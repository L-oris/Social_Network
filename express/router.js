const express = require('express'),
      router = express.Router()

const {uploader,uploadToS3} = require('./middlewares')
const {createUser, checkUser, updateProfilePic} = require('../database/methods')


//CREATE NEW USER INTO DATABASE
router.post('/register', function(req,res,next){
  const {first,last,email,password} = req.body
  if(!(first&&last&&email&&password)){
    throw 'Not all fields provided for registering a new user'
  }
  createUser(req.body)
  .then(function(userData){
    req.session.user = userData
    res.json({success:true})
  })
  .catch(function(err){
    //pass error to next Express error handler
    next('Error happened adding user to database')
  })
})

//CHECK FOR ALREADY REGISTERED USER
router.post('/login', function(req,res,next){
  const {email,password} = req.body
  if(!(email&&password)){
    throw 'Not all fields provided for logging in the user'
  }
  checkUser(req.body)
  .then(function(userData){
    req.session.user = userData
    res.json({success:true})
  })
  .catch(function(err){
    //pass error to next Express error handler
    next('User not found')
  })
})

//GET LOGGED-IN USER INFO
router.get('/getUser',function(req,res){
  if(!req.session.user){
    throw 'No logged in user in current session'
  }
  res.json(req.session.user)
})

//UPDATE USER'S PROFILE PICTURE
router.put('/upload_profile_pic',uploader.single('file'),uploadToS3,function(req,res){
  const {user_id} = req.session.user
  const {filename} = req.file
  if(!filename){
    throw 'No file to upload'
  }
  updateProfilePic(user_id,filename)
  .then(function(userData){
    res.json(userData)
  })
  .catch(function(err){
    next('Uploading of new image failed')
  })
})


module.exports = router
