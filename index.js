const express = require('express'),
      app = express(),
      server = require('http').Server(app),
      io = require('socket.io')(server)

const {middlewares} = require('./express/middlewares'),
      RESTfulRouter = require('./express/RESTfulRouter')

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

let onlineUsers = []

app.post('/api/connected/:socketId',function(req,res,next){
  const {socketId} = req.params
  const {user_id:userId} = req.session.user
  //if current socket not inside 'onlineUsers' already, then add it and send back complete list of online users
  const socketAlreadyThere = onlineUsers.find(socket=>socket===socketId)
  if(!socketAlreadyThere){
    onlineUsers.push({
      userId,socketId
    })
    //search for users by id based on ids stored inside onlineUsers[]
    io.sockets.sockets[socketId].emit('onlineUsers',[{a:'a'},{b:'b'},{c:'c'}])
  }
  res.json({success:true})
})

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


//LISTER FOR EVENTS FROM 'SOCKET.IO'
io.on('connection', function(socket){
  console.log(`socket with the id ${socket.id} is now connected`)

  socket.on('disconnect', function(){
    console.log(`socket with the id ${socket.id} is now disconnected`)
  })

})
