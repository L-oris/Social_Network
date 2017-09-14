import axios from './axios'

export function getFriends(){
  return axios.get('/api/getFriends')
  .then((serverResponse)=>{
    return {
      type: 'GET_FRIENDS',
      friends: serverResponse.data
    }
  })
}
