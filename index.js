const express = require('express'),
      app = express(),
      server = require('http').Server(app),
      io = require('socket.io')(server)

const {middlewares} = require('./express/middlewares'),
      RESTfulRouter = require('./express/RESTfulRouter'),
      socket_io = require('./express/socket_io')


if(process.env.NODE_ENV != 'production'){
  app.use('/bundle.js', require('http-proxy-middleware')({
    target: 'http://localhost:8081'
  }))
}

//apply middlewares
middlewares(app)

//serve static files
app.use(express.static('./public'))

//apply RESTful routes
app.use('/',RESTfulRouter)

//apply socket.io
socket_io(app,io)


//REDIRECT USER BASED ON HIS REGISTRATION STATUS
app.get('*', function(req,res){
  if(!req.session.user && req.url !== '/welcome'){
    return res.redirect('/welcome')
  }
  res.sendFile(__dirname + '/index.html')
})

//handle 'Express' errors
app.use(function (err, req, res, next){
  console.log(`Error Handling Middleware --> ${err}`)
  res.status(500).json({success:false})
})


const port = 8080
server.listen(port, function() {
  console.log(`Server listening on port ${port}`)
})
