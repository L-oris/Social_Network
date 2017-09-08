const express = require('express'),
      app = express()

const {middlewares,uploader,uploadToS3} = require('./express/middlewares')

const {createUser, checkUser, updateProfilePic} = require('./database/methods')

if(process.env.NODE_ENV != 'production'){
  app.use(require('./build'))
}

//apply middleware
middlewares(app)
//SERVE STATIC FILES
app.use(express.static('./public'))


//REDIRECT USER BASED ON HIS REGISTRATION STATUS
app.get('/', function(req,res){
  if(!req.session.user){
    return res.redirect('/welcome')
  }
  res.sendFile(__dirname + '/index.html')
})

//REDIRECT USER BASED ON HIS REGISTRATION STATUS
app.get('/welcome', function(req,res){
  if(req.session.user){
    return res.redirect('/')
  }
  res.sendFile(__dirname + '/index.html')
})

//CREATE NEW USER INTO DATABASE
app.post('/register', function(req,res,next){
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
app.post('/login', function(req,res,next){
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

app.get('/getUser',function(req,res){
  if(!req.session.user){
    throw 'No logged in user in current session'
  }
  res.json(req.session.user)
})

app.put('/upload_profile_pic',uploader.single('file'),uploadToS3,function(req,res){
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

//catch all request for unexisting routes
app.get('*',function(req,res){
  res.send('Route not found')
})

//handle 'Express' errors
app.use(function (err, req, res, next){
  console.log(`Error inside Express Server: ${err}`)
  res.status(500).json({success:false})
})


const port = 8080
app.listen(port, function() {
  console.log(`Server listening on port ${port}`)
})
