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
      onlineUsers: action.onlineUsers,
      privateMessages: {},
      privateMessageNotifications: []
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
      chatMessages: [action.message,...state.chatMessages]
    })
  }

  if(action.type==='CREATE_PRIVATE_CHAT_MESSAGES'){
    const {friendId,messages} = action.chatMessages
    return Object.assign({},state,{
      privateMessages: Object.assign({},state.privateMessages,{[friendId]: messages.reverse()})
    })
  }

  if(action.type==='ADD_PRIVATE_CHAT_MESSAGE'){
    const {friendId,message} = action.message
    return Object.assign({},state,{
      privateMessages: Object.assign({},state.privateMessages,{
        [friendId]: [...state.privateMessages[friendId], message]
      })
    })
  }

  if(action.type==='ADD_PRIVATE_MESSAGE_NOTIFICATION'){
    return Object.assign({},state,{
      privateMessageNotifications: [...state.privateMessageNotifications,action.friendId]
    })
  }

  if(action.type==='REMOVE_PRIVATE_MESSAGE_NOTIFICATION'){
    return Object.assign({},state,{
      privateMessageNotifications: state.privateMessageNotifications.filter(userId=>userId!=action.friendId)
    })
  }

  return state
}
