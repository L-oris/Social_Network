import React from 'react'
import {connect} from 'react-redux'

function Online(props){
  let htmlOnlineUsersList = ''
  if(props.onlineUsers){
    htmlOnlineUsersList = props.onlineUsers.map(user=>{
      return (
        <li>
          <h3>{user.first} {user.last}</h3>
          <img className="small-deleteme" src={user.profilePicUrl}/>
        </li>
      )
    })
  }
  return (
    <div>
      <h1>List of online users!</h1>
      <ul>{htmlOnlineUsersList}</ul>
    </div>
  )
}

function mapStateToProps(reduxState){
  return {
    onlineUsers: reduxState.onlineUsers
  }
}

export default connect(mapStateToProps)(Online)
