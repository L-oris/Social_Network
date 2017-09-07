const express = require('express'),
      app = express(),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      cookieSession = require('cookie-session')

const {createUser, checkUser} = require('./database/methods')

if(process.env.NODE_ENV != 'production'){
  app.use(require('./build'))
}

app.use(compression())
app.use(cookieSession({
  secret: require('./secret.json').sessionSecret,
  maxAge: 1000 * 60 * 60 * 24 * 14
}))
app.use(bodyParser.json());
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
    //set default profile picture for new user
    req.session.profilePicUrl = 'https://s3.amazonaws.com/social-network-loris/765-default-avatar.png'
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
    //set default profile picture if user doesn't have one
    if(!userData.profilePicUrl){
      userData.profilePicUrl = 'https://s3.amazonaws.com/social-network-loris/765-default-avatar.png'
    }
    req.session.user = userData
    res.json({success:true})
  })
  .catch(function(err){
    //pass error to next Express error handler
    next('User not found')
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
