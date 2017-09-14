import axios from './axios'

export function getFriends(){
  return axios.get('/api/get_friends_list')
  .then((serverResponse)=>{
    return {
      type: 'GET_FRIENDS',
      friends: serverResponse.data
    }
  })
}

export function acceptFriendship(friend_id){
  return axios.post('/api/friend_go',{id:friend_id})
  .then(()=>{
    return {
      type: 'ACCEPT_FRIEND',
      friend_id
    }
  })
}

export function removeFriendship(friend_id){
  return axios.post('/api/friend_stop',{id:friend_id})
  .then(()=>{
    return {
      type: 'REMOVE_FRIEND',
      friend_id
    }
  })
}
