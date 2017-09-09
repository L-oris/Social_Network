const express = require('express'),
      router = express.Router()

const {uploader,uploadToS3} = require('./middlewares')
const {createUser, checkUser, getUser, updateProfilePic} = require('../database/methods')


//CREATE NEW USER INTO DATABASE
router.post('/api/register', function(req,res,next){
  const {first,last,email,password} = req.body
  if(!(first&&last&&email&&password)){
    return next('Not all fields provided for registering a new user')
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
    return next('Not all fields provided for logging in the user')
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
    return next('No logged in user in current session')
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

//UPDATE USER'S PROFILE PICTURE
router.put('/api/upload_profile_pic',uploader.single('file'),uploadToS3,function(req,res){
  const {user_id} = req.session.user
  const {filename} = req.file
  if(!filename){
    return next('No file to upload')
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


module.exports = router
