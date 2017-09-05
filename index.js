const express = require('express'),
      app = express(),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      db = require('./database/db')


if(process.env.NODE_ENV != 'production'){
  app.use(require('./build'))
}

app.use(compression())
app.use(express.static('./public'))
app.use(bodyParser.json());

app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html')
})

app.get('/welcome', function(req,res){
  res.sendFile(__dirname + '/index.html')
})

//REGISTER NEW USER INTO DATABASE
app.post('/register', function(req,res,next){
  const {first,last,email,password} = req.body;
  const query = 'INSERT INTO users (first,last,email,password) VALUES ($1,$2,$3,$4)'
  db.query(query,[first,last,email,password])
  .then(function(){
    res.json({success:true})
  })
  .catch(function(err){
    //pass error to next Express error handler
    next('Error happened adding user to database')
  })
})

//catch all request for unexisting routes
app.get('*',function(req,res){
  res.send('nothing found')
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
