const express = require('express')
const app = express()
const compression = require('compression')
const bodyParser = require('body-parser');

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

//REGISTER NEW USER
app.post('/register', function(req,res){
  console.log('request received, body is',req.body);
  res.send('request received')
})

app.get('*',function(req,res){
  res.send('nothing found')
})

app.listen(8080, function() {
    console.log("I'm listening.")
})
