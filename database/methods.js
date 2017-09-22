const db = require('./db');
const {hashPassword,checkPassword} = require('./hashing')
const {s3Url} = require('../config/config.json')
const defaultImageUrl = 'profile-default.jpg'

module.exports.createUser = function({first,last,email,password}){
  return hashPassword(password)
  .then(function(hash){
    const query = `INSERT INTO users (first,last,email,password,profilepicurl) VALUES ($1,$2,$3,$4,'${defaultImageUrl}') RETURNING id,first,last,email,profilepicurl`
    return db.query(query,[first,last,email,hash])
  })
  .then(function(userData){
    return {
      user_id:userData.rows[0].id,
      first:userData.rows[0].first,
      last:userData.rows[0].last,
      email:userData.rows[0].email,
      profilePicUrl:s3Url+userData.rows[0].profilepicurl,
      bio:null
    }
  })
}

module.exports.loginUser = function({email,password:plainTextPassword}){
  //here password passed in has been renamed to 'plainTextPassword'
  const query = 'SELECT id,first,last,email,password,profilepicurl,bio FROM users WHERE email = $1'
  return db.query(query,[email])
  .then(function(userData){
    //create object containing useful user's data
    return {
      user_id:userData.rows[0].id,
      first:userData.rows[0].first,
      last:userData.rows[0].last,
      email:userData.rows[0].email,
      profilePicUrl:s3Url+userData.rows[0].profilepicurl,
      bio:userData.rows[0].bio,
      hashedPassword:userData.rows[0].password
    }
  })
  .then(function({user_id,first,last,email,hashedPassword,profilePicUrl,bio}){
    //compare saved password with new one provided from user
    return checkPassword(plainTextPassword,hashedPassword)
    .then(function(doesMatch){
      if(!doesMatch){
        throw 'Passwords do not match!'
      }
      return {
        user_id,first,last,email,profilePicUrl,bio
      }
    })
  })
}

module.exports.updateBio = function(user_id,bio){
  const query = 'UPDATE users SET bio = $1 WHERE id = $2'
  return db.query(query,[bio,user_id])
  .then(function(){
    return {
      bio
    }
  })
}

module.exports.updateProfilePic = function(user_id,filename){
  const query = 'UPDATE users SET profilepicurl = $1 WHERE id = $2'
  return db.query(query,[filename,user_id])
  .then(function(){
    return {
      profilePicUrl: s3Url+filename
    }
  })
}

module.exports.getFriends = function(user_id){
  const query = `
    SELECT users.id,first,last,profilepicurl,status
    FROM friendships INNER JOIN users
    ON (friendships.status = 'PENDING' AND receiver_id = $1 AND sender_id = users.id)
    OR (friendships.status = 'ACCEPT' AND sender_id = $1 AND receiver_id = users.id)
    OR (friendships.status = 'ACCEPT' AND receiver_id = $1 AND sender_id = users.id)`
  return db.query(query,[user_id])
  .then(function(dbFriends){
    return dbFriends.rows.map(friend=>{
      const {id,first,last,status,profilepicurl} = friend
      return {
        id,first,last,status,
        profilePicUrl: s3Url+profilepicurl
      }
    })
  })
}

module.exports.searchUserById = function(user_id){
  const query = 'SELECT id,first,last,email,profilepicurl,bio FROM users WHERE id = $1'
  return db.query(query,[user_id])
  .then(function(userData){
    if(!userData){
      throw 'User not found'
    }
    return {
      id:userData.rows[0].id,
      first:userData.rows[0].first,
      last:userData.rows[0].last,
      email:userData.rows[0].email,
      profilePicUrl:s3Url+userData.rows[0].profilepicurl,
      bio:userData.rows[0].bio
    }
  })
}

module.exports.searchUsersById = function(idArray){
  const query = 'SELECT id,first,last,profilepicurl FROM users WHERE id = ANY($1)'
  return db.query(query,[idArray])
  .then(function(dbUsers){
    return dbUsers.rows.map(dbUser=>{
      const {id,first,last,profilepicurl} = dbUser
      return {
        id,first,last,
        profilePicUrl: s3Url+profilepicurl
      }
    })
  })
}

module.exports.searchUsersByName = function(nameString){
  const namesArr = nameString.split(" ").map(name=>`${name}%`)
  let query
  if(namesArr.length===1){
    query = 'SELECT id,first,last,email,profilepicurl,bio FROM users WHERE first ILIKE $1 OR last ILIKE $1'
  } else {
    query = 'SELECT id,first,last,email,profilepicurl,bio FROM users WHERE (first ILIKE $1 AND last ILIKE $2) OR (first ILIKE $2 AND last ILIKE $1)'
  }
  //if more than 2 words provided, just take first ones
  return db.query(query,namesArr.slice(0,2))
  .then(function(dbFriends){
    return dbFriends.rows.map(friend=>{
      const {id,first,last,email,profilepicurl,bio} = friend
      return {
        id,first,last,email,bio,
        profilePicUrl: s3Url+profilepicurl
      }
    })
  })
}



function getNextGoStatus(currentStatus,isSender){
  let user
  isSender ? user = 'SENDER' : user = 'RECEIVER'
  const key = `${currentStatus.toUpperCase()}_${user}`
  const statuses = {
    nothing_SENDER: 'PENDING', //not used, useful here just for understanding friendship flow
    PENDING_RECEIVER: 'ACCEPT'
  }
  return statuses[key]
}

function getNextStopStatus(currentStatus,isSender){
  let user
  isSender ? user = 'SENDER' : user = 'RECEIVER'
  const key = `${currentStatus.toUpperCase()}_${user}`
  const statuses = {
    PENDING_SENDER: 'CANCEL',
    ACCEPT_SENDER: 'TERMINATE',
    PENDING_RECEIVER: 'REJECT',
    ACCEPT_RECEIVER: 'TERMINATE',
  }
  return statuses[key]
}

module.exports.getNextFriendshipState = function(user_id,friend_id){
  const query = 'SELECT sender_id,status FROM friendships WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)'
  return db.query(query,[user_id,friend_id])
  .then(function(userData){
    //when no existing friendship found return button statuses for creating new one
    if(!userData.rows[0]){
      return {
        nextGoStatus: 'PENDING',
        nextStopStatus: ''
      }
    }
    const {status,sender_id} = userData.rows[0]
    return {
      nextGoStatus: getNextGoStatus(status,sender_id===user_id) || '',
      nextStopStatus: getNextStopStatus(status,sender_id===user_id) || ''
    }
  })
}

module.exports.createFriendshipStatus = function(user_id,friend_id){
  const query = `INSERT INTO friendships (sender_id,receiver_id,status) VALUES ($1,$2,'PENDING') RETURNING status,sender_id`
  return db.query(query,[user_id,friend_id])
  .then(function(userData){
    const {status,sender_id} = userData.rows[0]
    return {
      nextGoStatus: getNextGoStatus(status,sender_id===user_id) || '',
      nextStopStatus: getNextStopStatus(status,sender_id===user_id) || ''
    }
  })
}

module.exports.updateFriendShipStatus = function(user_id,friend_id,newStatus){
  const query = 'UPDATE friendships SET status = $3 WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) RETURNING status,sender_id'
  return db.query(query,[user_id,friend_id,newStatus])
  .then(function(userData){
    const {status,sender_id} = userData.rows[0]
    return {
      nextGoStatus: getNextGoStatus(status,sender_id===user_id) || '',
      nextStopStatus: getNextStopStatus(status,sender_id===user_id) || ''
    }
  })
}

module.exports.deleteFriendshipStatus = function(user_id,friend_id){
  const query = 'DELETE FROM friendships WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)'
  return db.query(query,[user_id,friend_id])
  .then(function(){
    return {
      nextGoStatus: 'PENDING',
      nextStopStatus: ''
    }
  })
}


module.exports.addChatMessage = function(user_id,message){
  const query = 'INSERT INTO messages (user_id,message) VALUES ($1,$2) RETURNING created_at'
  return db.query(query,[user_id,message])
  .then(function(dbMessage){
    return dbMessage.rows[0].created_at
  })
}

module.exports.getPrivateChat = function(userId,friendId){
  const query = 'SELECT sender_id,message,created_at FROM private_messages WHERE (sender_id = $2 AND receiver_id = $1) OR (sender_id = $1 AND receiver_id = $2) ORDER BY created_at DESC LIMIT 10'
  return db.query(query,[userId,friendId])
  .then(function(dbMessages){
    const messages = dbMessages.rows.map(message=>{
      return {
        ownMessage: message.sender_id == userId,
        message: message.message,
        timestamp: message.created_at
      }
    })
    return {
      friendId,messages
    }
  })
}

module.exports.addPrivateChatMessage = function(userId,friendId,newMessage){
  const query = 'INSERT INTO private_messages (sender_id,receiver_id,message) VALUES ($1,$2,$3) RETURNING created_at'
  return db.query(query,[userId,friendId,newMessage])
  .then(function(dbData){
    const user_message = {
      ownMessage: true,
      message: newMessage,
      timestamp: dbData.rows[0].created_at
    }
    const friend_message = {
      ownMessage: false,
      message: newMessage,
      timestamp: dbData.rows[0].created_at
    }

    return {
      userMessage:{
        friendId: friendId,
        message: user_message
      },
      friendMessage:{
        friendId: userId,
        message: friend_message
      }
    }
  })
}
