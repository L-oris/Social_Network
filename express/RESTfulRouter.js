const express = require('express'),
      router = express.Router()

const {uploader,uploadToS3} = require('./middlewares')
const {createUser, checkUser, getUser, getNextUserFriendshipState, updateProfilePic, updateBio} = require('../database/methods')


//CREATE NEW USER INTO DATABASE
router.post('/api/register', function(req,res,next){
  const {first,last,email,password} = req.body
  if(!(first&&last&&email&&password)){
    throw 'Not all fields provided for registering a new user'
  }
  createUser(req.body)
  .then(function(userData){
    //set user info inside session
    req.session.user = userData
    res.json({success:true})
  })
  .catch(function(err){
    //pass error to next Express error handler
    next('Error happened adding user to database')
  })
})

//CHECK FOR ALREADY REGISTERED USER
router.post('/api/login', function(req,res,next){
  const {email,password} = req.body
  if(!(email&&password)){
    throw 'Not all fields provided for logging in the user'
  }
  checkUser(req.body)
  .then(function(userData){
    //set user info inside session
    req.session.user = userData
    res.json({success:true})
  })
  .catch(function(err){
    //pass error to next Express error handler
    next('User not found')
  })
})

//GET LOGGED-IN USER'S INFO (FROM SESSION)
router.get('/api/getUser',function(req,res){
  if(!req.session.user){
    throw 'No logged in user in current session'
  }
  res.json(req.session.user)
})

//SEARCH FOR USER INFO BY ID (FROM DATABASE)
router.get('/api/getUser/:id',function(req,res){
  //when user tries to get his own profile, send back 301 HTTP Redirect status
  if(req.params.id == req.session.user.user_id){
    return res.status(301).json({success:false})
  }
  getUser(req.params.id)
  .then(function(userData){
    res.json(userData)
  })
  .catch(function(err){
    res.status(404).json({success:false})
  })
})

//SEND BACK NEXT STATE FOR BOTH 'GoButton' and 'StopButton'
router.get('/api/getUserFriendship/:id',function(req,res){
  const {user_id} = req.session.user
  const {id:friend_id} = req.params
  getNextUserFriendshipState(user_id,friend_id)
  .then(function(userData){
    res.json(userData)
  })
  .catch(function(err){
    //pass error to next Express error handler
    next('Error happened when calculating next possible friendship statuses')
  })
})

//UPDATE NEW FRIENDSHIP STATUS
router.post('/api/friend_go',function(req,res){
  //calculate next stop status, update database, calculate updated next possible statuses and send them back to client
  const {user_id} = req.session.user
  const {id:friend_id} = req.body
  getNextUserFriendshipState(user_id,friend_id)
  .then(function({nextGoStatus}){
    if(nextGoStatus==='PENDING'){
      return createFriendshipStatus(user_id,friend_id)
    }
    return updateFriendShipStatus(user_id,friend_id,nextGoStatus)
  })
  .then(function({nextGoStatus,nextStopStatus}){
    res.json({
      nextGoStatus, nextStopStatus
    })
  })
  .catch(function(err){
    //pass error to next Express error handler
    next('Failed to update friendship status')
  })
})

//UPDATE NEW FRIENDSHIP STATUS
router.post('/api/friend_stop',function(req,res){
  //calculate next stop status, update database, calculate updated next possible statuses and send them back to client
  const {user_id} = req.session.user
  const {id:friend_id} = req.body
  getNextUserFriendshipState(user_id,friend_id)
  .then(function({nextStopStatus}){
    if(nextStopStatus==='REJECT' || nextStopStatus==='CANCEL' || nextStopStatus==='TERMINATE'){
      return deleteFriendshipStatus(user_id,friend_id)
    }
    return updateFriendShipStatus(user_id,friend_id,nextStopStatus)
  })
  .then(function({nextGoStatus,nextStopStatus}){
    res.json({
      nextGoStatus, nextStopStatus
    })
  })
  .catch(function(err){
    //pass error to next Express error handler
    next('Failed to update friendship status')
  })
})

//UPDATE USER'S PROFILE PICTURE
router.put('/api/upload_profile_pic',uploader.single('file'),uploadToS3,function(req,res,next){
  const {user_id} = req.session.user
  const {filename} = req.file
  if(!filename){
    throw 'No file to upload'
  }
  updateProfilePic(user_id,filename)
  .then(function(userData){
    req.session.user.profilePicUrl = userData.profilePicUrl
    res.json(userData)
  })
  .catch(function(err){
    next('Uploading of new image failed')
  })
})

//UPDATE USER'S BIO
router.put('/api/update_bio',function(req,res,next){
  const {bio} = req.body
  const {user_id} = req.session.user
  if(!bio){
    throw 'No bio provided'
  }
  updateBio(user_id,bio)
  .then(function(userData){
    req.session.user.bio = userData.bio
    res.json(userData)
  })
  .catch(function(err){
    next('Updating bio failed')
  })
})

//LOGOUT USER
router.get('/api/logout',function(req,res){
  req.session = null
  res.redirect('/welcome')
})


module.exports = router
