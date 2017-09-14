export default function(state={},action){

  if(action.type==='GET_FRIENDS'){
    return Object.assign({},state,{
      friends: action.friends
    })
  }

  if(action.type==='ACCEPT_FRIEND'){
    return Object.assign({},state,{
      friends: state.friends.map(friend=>{
        if(action.friend_id===friend.id){
          friend.status='ACCEPT'
        }
        return friend
      })
    })
  }

  if(action.type==='REMOVE_FRIEND'){
    return Object.assign({},state,{
      friends: state.friends.filter(friend=>{
        return friend.id!==action.friend_id
      })
    })
  }

  return state
}
