const express = require('express'),
      app = express(),
      server = require('http').Server(app),
      io = require('socket.io')(server)

const {middlewares} = require('./express/middlewares'),
      RESTfulRouter = require('./express/RESTfulRouter'),
      {searchUserById,searchUsersById} = require('./database/methods')

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

//LISTER FOR EVENTS FROM 'SOCKET.IO'
io.on('connection', function(socket){
  socket.on('disconnect', function(){
    //inform all online users about new disconnected one
    const objToRemove = onlineUsers.filter(user=>user.socketId===socket.id)
    onlineUsers.splice(onlineUsers.indexOf(objToRemove[0]),1)
    if(objToRemove.length===1){
      io.sockets.emit('userLeft',{userId:objToRemove[0].userId})
    }
  })
})

app.post('/api/connected/:socketId',function(req,res,next){
  const {socketId} = req.params
  const {user_id:userId} = req.session.user
  //if current socket not inside 'onlineUsers' already, then add it and send back complete list of online users
  const socketAlreadyThere = onlineUsers.find(socket=>socket===socketId)
  if(!socketAlreadyThere){
    onlineUsers.push({
      userId,socketId
    })
    //inform all other online users about new connected one, if is new
    const numberOfSocketsPerUser = onlineUsers.filter(user=>user.userId===userId)
    if(numberOfSocketsPerUser.length===1){
      searchUserById(userId)
      .then(function(userData){
        io.sockets.emit('userJoined',userData)
      })
    }
    //search for users by id based on ids stored inside onlineUsers[]
    const onlineIds = onlineUsers.map(user=>user.userId)
    searchUsersById(onlineIds)
    .then(function(users){
      io.sockets.sockets[socketId].emit('onlineUsers',users)
      res.json({success:true})
    })
    .catch(function(err){
      next('Failed getting online users list');
    })
  } else {
    res.json({success:false})
  }
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
