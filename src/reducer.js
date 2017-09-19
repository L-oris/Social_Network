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

  if(action.type==='SEARCH_USER_BY_NAME'){
    return Object.assign({},state,{
      searchedUsersList: action.searchedUsersList
    })
  }

  if(action.type==='CREATE_ONLINE_USERS'){
    return Object.assign({},state,{
      onlineUsers: action.onlineUsers
    })
  }

  if(action.type==='ADD_ONLINE_USER'){
    return Object.assign({},state,{
      onlineUsers: [...state.onlineUsers,action.user]
    })
  }

  if(action.type==='REMOVE_ONLINE_USER'){
    return Object.assign({},state,{
      onlineUsers: state.onlineUsers.filter(user => user.id!==action.userId)
    })
  }

  if(action.type==='CREATE_CHAT_MESSAGES'){
    return Object.assign({},state,{
      chatMessages: action.chatMessages
    })
  }

  if(action.type==='ADD_CHAT_MESSAGE'){
    return Object.assign({},state,{
      chatMessages: [...state.chatMessages,action.message]
    })
  }

  if(action.type==='CREATE_PRIVATE_CHAT_MESSAGES'){
    const {friendId,messages} = action.chatMessages
    return Object.assign({},state,{
      privateMessages: Object.assign({},state.privateMessages,{[friendId]: messages})
    })
  }

  return state
}
