import React,{Component} from 'react'
import {connect} from 'react-redux'
import getSocket from '../socket'
import {store} from '../start'


//React components
import PrivateChat from './PrivateChat'

class Online extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  handleClickedUser(friendId){
    //check if private conversations already saved into Redux store, otherwise fetch from database
    if(!store.getState().privateMessages[friendId]){
      getSocket().emit('privateMessages',{friendId})
    }
    this.setState({
      chattingFriendId: friendId
    })
  }

  render(){

    const displayOnlineUsers = ()=>{
      return this.props.onlineUsers.map(user=>{
        return (
          <li onClick={e=>this.handleClickedUser(user.id)}>
            <h3>{user.first} {user.last}</h3>
            <img className="small-deleteme" src={user.profilePicUrl}/>
          </li>
        )
      })
    }

    return (
      <div>
        <h1>List of online users!</h1>
        <ul>
          {this.props.onlineUsers && displayOnlineUsers(this.props.onlineUsers)}
        </ul>
        <h4>notifications: {this.props.privateMessageNotifications}</h4>
        <PrivateChat friendId={this.state.chattingFriendId}/>
      </div>
    )
  }

}

function mapStateToProps(reduxState){
  return {
    onlineUsers: reduxState.onlineUsers,
    privateMessageNotifications: reduxState.privateMessageNotifications
  }
}

export default connect(mapStateToProps)(Online)
