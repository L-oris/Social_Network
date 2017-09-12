const db = require('./db');
const {hashPassword,checkPassword} = require('./hashing')
const {s3Url} = require('../config/config.json')

module.exports.createUser = function({first,last,email,password}){
  return hashPassword(password)
  .then(function(hash){
    const query = 'INSERT INTO users (first,last,email,password) VALUES ($1,$2,$3,$4) RETURNING id,first,last,email'
    return db.query(query,[first,last,email,hash])
  })
  .then(function(userData){
    return {
      user_id:userData.rows[0].id,
      first:userData.rows[0].first,
      last:userData.rows[0].last,
      email:userData.rows[0].email,
      profilePicUrl:'https://s3.amazonaws.com/social-network-loris/765-default-avatar.png',
      bio:null
    }
  })
}

module.exports.checkUser = function({email,password:plainTextPassword}){
  //here password passed in has been renamed to 'plainTextPassword'
  const query = 'SELECT id,first,last,email,password,profilepicurl,bio FROM users WHERE email = $1'
  return db.query(query,[email])
  .then(function(userData){
    //create object containing useful user's data
    return {
      id:userData.rows[0].id,
      first:userData.rows[0].first,
      last:userData.rows[0].last,
      email:userData.rows[0].email,
      profilePicUrl:userData.rows[0].profilepicurl,
      bio:userData.rows[0].bio,
      hashedPassword:userData.rows[0].password
    }
  })
  .then(function(userObj){
    //compare saved password with new one provided from user
    return checkPassword(plainTextPassword,userObj.hashedPassword)
    .then(function(doesMatch){
      //if passwords match return from promise 'id','firstName','lastName' of currently searched user, otherwise throw an error
      if(!doesMatch){
        throw 'Passwords do not match!'
      }
      if(userObj.profilePicUrl){
        //append path to AWS S3
        userObj.profilePicUrl = s3Url + userObj.profilePicUrl
      }
      return {
        user_id: userObj.id,
        first: userObj.first,
        last: userObj.last,
        email: userObj.email,
        profilePicUrl: userObj.profilePicUrl || 'https://s3.amazonaws.com/social-network-loris/765-default-avatar.png',
        bio: userObj.bio
      }
    })
  })
}

module.exports.getUser = function(user_id){
  const query = 'SELECT first,last,email,profilepicurl,bio FROM users WHERE id = $1'
  return db.query(query,[user_id])
  .then(function(userData){
    if(!userData){
      throw 'User not found'
    }
    let profilePicUrl = userData.rows[0].profilepicurl
    if(profilePicUrl){
      //append path to AWS S3
      profilePicUrl = s3Url + profilePicUrl
    }
    return {
      first:userData.rows[0].first,
      last:userData.rows[0].last,
      email:userData.rows[0].email,
      profilePicUrl:profilePicUrl || 'https://s3.amazonaws.com/social-network-loris/765-default-avatar.png',
      bio:userData.rows[0].bio
    }
  })
}


function getNextGoStatus(currentStatus,isSender){
  let user
  isSender ? user = 'SENDER' : user = 'RECEIVER'
  const key = `${currentStatus.toUpperCase()}_${user}`
  const statuses = {
    NONE_SENDER: 'PENDING', //not used, useful here just for understanding friendship flow
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

module.exports.getNextUserFriendshipState = function(user_id,friend_id){
  const query = 'SELECT sender_id,status FROM friendships WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)'
  return db.query(query,[user_id,friend_id])
  .then(function(userData){
    //when no existing friendship found
    if(!userData.rows[0]){
      return {
        nextGoStatus: 'PENDING',
        nextStopStatus: ''
      }
    }
    const {status,sender_id} = userData.rows[0]
    const nextGoStatus = getNextGoStatus(status,sender_id===user_id) || ''
    const nextStopStatus = getNextStopStatus(status,sender_id===user_id) || ''
    return {
      nextGoStatus, nextStopStatus
    }
  })
}

module.exports.createFriendshipStatus = function(user_id,friend_id){
  const query = `INSERT INTO friendships (sender_id,receiver_id,status) VALUES ($1,$2,'PENDING') RETURNING status,sender_id`
  return db.query(query,[user_id,friend_id])
  .then(function(userData){
    const {status,sender_id} = userData.rows[0]
    const nextGoStatus = getNextGoStatus(status,sender_id===user_id) || ''
    const nextStopStatus = getNextStopStatus(status,sender_id===user_id) || ''
    return {
      nextGoStatus, nextStopStatus
    }
  })
}

module.exports.updateFriendShipStatus = function(user_id,friend_id,newStatus){
  const query = 'UPDATE friendships SET status = $3 WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) RETURNING status,sender_id'
  return db.query(query,[user_id,friend_id,newStatus])
  .then(function(userData){
    const {status,sender_id} = userData.rows[0]
    const nextGoStatus = getNextGoStatus(status,sender_id===user_id) || ''
    const nextStopStatus = getNextStopStatus(status,sender_id===user_id) || ''
    return {
      nextGoStatus, nextStopStatus
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

module.exports.updateProfilePic = function(user_id,filename){
  const query = 'UPDATE users SET profilepicurl = $1 WHERE id = $2'
  return db.query(query,[filename,user_id])
  .then(function(){
    return {
      profilePicUrl: s3Url+filename
    }
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
