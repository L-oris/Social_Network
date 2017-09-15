import * as io from 'socket.io-client'
import axios from './axios'
import {store} from './start'
import {addOnlineUsers} from './actions'

let socket

export default function getSocket(){
  if(!socket){
    socket = io.connect()
    socket.on('connect',function(){
      axios.post(`/api/connected/${socket.id}`)
    })
    socket.on('onlineUsers',function(onlineUsers){
      store.dispatch(addOnlineUsers(onlineUsers))
    })
    socket.on('userJoined',function(newOnlineUser){
      console.log('new online user is now',newOnlineUser);
    })
    socket.on('userLeft',function(offlineUser){
      console.log('offline user is',offlineUser);
    })
  }
  return socket
}
