import * as io from 'socket.io-client'

let socket

export default function getSocket(){
  if(!socket){
    socket = io.connect()
    socket.on('connect',function(){
      console.log('client-side application connected');
    })
  }
  return socket
}
