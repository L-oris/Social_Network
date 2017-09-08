const express = require('express'),
      app = express(),
      fs = require('fs'),
      path = require('path'),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      cookieSession = require('cookie-session'),
      multer = require('multer'),
      uidSafe = require('uid-safe'),
      knox = require('knox')

const {createUser, checkUser, updateProfilePic} = require('./database/methods')

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

//image uploading
const diskStorage = multer.diskStorage({
  destination: function (req, file, callback){
    callback(null, path.join(__dirname + '/uploads'))
  },
  filename: function (req, file, callback){
    uidSafe(24).then(function(uid){
      callback(null, uid + path.extname(file.originalname))
    })
  }
})

const uploader = multer({
  storage: diskStorage,
  limits: {
    filesize: 2097152
  }
})

//setup 'knox' module to upload files to Amazon S3 Service
let secrets
if(process.env.NODE_ENV==='production'){
  secrets = process.env
} else {
  secret = require('./secret.json')
}
const client = knox.createClient({
  key: secret.AWS_KEY,
  secret: secret.AWS_SECRET,
  bucket: 'social-network-loris'
})

const uploadToS3 = function(req,res,next){
  const s3Request = client.put(req.file.filename,{
    'Content-Type': req.file.mimetype,
    'Content-Length': req.file.size,
    'x-amz-acl': 'public-read'
  })
  fs.createReadStream(req.file.path).pipe(s3Request)
  s3Request.on('response', function(s3Response){
    if(s3Response.statusCode !== 200){
      res.json({success: false})
    } else {
      next()
    }
  })
}


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
