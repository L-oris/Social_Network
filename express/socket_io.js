const {searchUserById,searchUsersById,addChatMessage} = require('../database/methods')

//add socket.io settings to current 'app'
module.exports = function(app,io){

  let onlineUsers = []
  let chatMessages = []

  //LISTER FOR EVENTS FROM 'SOCKET.IO'
  io.on('connection',function(socket){

    //socket disconnected
    socket.on('disconnect',function(){
      //remove disconnected socket from 'onlineUsers'
      const socketToRemove = onlineUsers.filter(user=>user.socketId===socket.id)[0]
      onlineUsers.splice(onlineUsers.indexOf(socketToRemove),1)

      //if removed socket was last one of currently disconnected user, means user has gone offline, so inform all online users about him
      const disconnectedUserSockets = onlineUsers.filter(user => user.userId===socketToRemove.userId)
      if(disconnectedUserSockets.length===0){
        io.sockets.emit('userLeft',{userId:socketToRemove.userId})
      }
    })

    //new message received
    socket.on('chatMessage',function(message){
      //save new message into database and add it to 'chatMessages' array
      const messageSender = onlineUsers.filter(user=>user.socketId===socket.id)[0]
      addChatMessage(messageSender.userId,message)
      .then(function(timestamp){
        return searchUserById(messageSender.userId)
        .then(function(userData){
          const {first,last,profilePicUrl} = userData

          const newChatMessage = {
            first,last,profilePicUrl,message,timestamp,
            user_id: messageSender.userId,
          }
          chatMessages.push(newChatMessage)

          //store no more than 10 messages on server
          chatMessages.length>10 && chatMessages.shift()

          //broadcast new message to all users
          io.sockets.emit('chatMessage',newChatMessage)
        })
      })
      .catch(function(err){
        console.log('Error adding chat message to database');
      })
    })
  })

  app.post('/api/connected/:socketId',function(req,res,next){
    const {socketId} = req.params
    const {user_id:userId} = req.session.user

    //send to new connected socket complete list of online users and last chat messages saved on server
    const onlineIds = onlineUsers.map(user=>user.userId)
    searchUsersById(onlineIds)
    .then(function(users){
      io.sockets.sockets[socketId].emit('onlineUsers',users)
      io.sockets.sockets[socketId].emit('chatMessages',chatMessages)
      res.json({success:true})
    })
    .catch(function(err){
      next('Failed getting online users list')
    })

    //push new socket into 'onlineUsers' list
    onlineUsers.push({
      userId,socketId
    })

    //if current socket corresponds to a new user, inform all online users about him
    const numberOfSocketsPerUser = onlineUsers.filter(user=>user.userId===userId)
    if(numberOfSocketsPerUser.length===1){
      searchUserById(userId)
      .then(function(userData){
        io.sockets.emit('userJoined',userData)
      })
    }
  })

}
