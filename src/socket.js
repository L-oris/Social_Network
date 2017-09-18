import * as io from 'socket.io-client'
import axios from './axios'
import {store} from './start'
import {createOnlineUsers,addOnlineUser,removeOnlineUser,createChatMessages,addChatMessage} from './actions'


let socket

export default function getSocket(){
  //if no sockets created before, create a new one that listens for events coming from server
  if(!socket){
    socket = io.connect()
    socket.on('connect',function(){
      axios.post(`/api/connected/${socket.id}`)
    })
    socket.on('onlineUsers',function(onlineUsers){
      store.dispatch(createOnlineUsers(onlineUsers))
    })
    socket.on('userJoined',function(newOnlineUser){
      store.dispatch(addOnlineUser(newOnlineUser))
    })
    socket.on('userLeft',function(newOfflineUser){
      store.dispatch(removeOnlineUser(newOfflineUser.userId))
    })
    socket.on('chatMessages',function(chatMessages){
      store.dispatch(createChatMessages(chatMessages))
    })
    socket.on('chatMessage',function(newChatMessage){
      store.dispatch(addChatMessage(newChatMessage))
    })
  }

  return socket
}
