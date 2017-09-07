const db = require('./db');
const {hashPassword,checkPassword} = require('./hashing')

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
  const query = 'SELECT id,first,last,email,password,profilePicUrl,bio FROM users WHERE email = $1'
  return db.query(query,[email])
  .then(function(userData){
    //create object containing useful user's data
    return {
      id:userData.rows[0].id,
      first:userData.rows[0].first,
      last:userData.rows[0].last,
      email:userData.rows[0].email,
      profilePicUrl:userData.rows[0].profilePicUrl,
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
