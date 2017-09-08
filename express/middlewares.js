const fs = require('fs'),
      path = require('path'),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      cookieSession = require('cookie-session'),
      multer = require('multer'),
      uidSafe = require('uid-safe'),
      knox = require('knox')


module.exports.middlewares = function(app){
  //apply middlewares
  app.use(compression())
  app.use(cookieSession({
    secret: require('../secret.json').sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
  }))
  app.use(bodyParser.json());
}


//image uploading
const diskStorage = multer.diskStorage({
  destination: function (req, file, callback){
    callback(null, path.join(__dirname + '/../uploads'))
  },
  filename: function (req, file, callback){
    uidSafe(24).then(function(uid){
      callback(null, uid + path.extname(file.originalname))
    })
  }
})

module.exports.uploader = multer({
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
  secret = require('../secret.json')
}
const client = knox.createClient({
  key: secret.AWS_KEY,
  secret: secret.AWS_SECRET,
  bucket: 'social-network-loris'
})

module.exports.uploadToS3 = function(req,res,next){
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
