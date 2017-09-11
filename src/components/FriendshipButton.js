import React from 'react'

export default function FriendshipButton ({friendshipGo,friendshipStop,handleFriendshipGo,handleFriendshipStop}){
  
  const renderFriendshipButton = ()=>{
    let htmlFriendshipButton
    if(friendshipGo){
      htmlFriendshipButton += <button onClick={handleFriendshipGo}>{friendshipGo}</button>
    }
    if(friendshipStop){
      htmlFriendshipButton += <button onClick={handleFriendshipStop}>{friendshipStop}</button>
    }
    return htmlFriendshipButton
  }

  return (
    <div>
      {renderFriendshipButton()}
    </div>
  )
}
