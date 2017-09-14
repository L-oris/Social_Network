import axios from './axios'

export function getFriends(){
  return axios.get('/api/get_friends')
  .then((serverResponse)=>{
    return {
      type: 'GET_FRIENDS',
      friends: serverResponse.data
    }
  })
}

export function acceptFriendship(friend_id){
  return axios.post('/api/friendship_go',{id:friend_id})
  .then(()=>{
    return {
      type: 'ACCEPT_FRIEND',
      friend_id
    }
  })
}

export function removeFriendship(friend_id){
  return axios.post('/api/friendship_stop',{id:friend_id})
  .then(()=>{
    return {
      type: 'REMOVE_FRIEND',
      friend_id
    }
  })
}

export function searchUserByName(nameString){
  return axios.post('/api/search_user_by_name',{name:nameString})
  .then(function(serverResponse){
    return {
      type: 'SEARCH_USER_BY_NAME',
      searchedUsersList: serverResponse.data
    }
  })
}
