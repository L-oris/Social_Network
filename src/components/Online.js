import React,{Component} from 'react'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'
import getSocket from '../socket'
import {store} from '../start'


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
    browserHistory.push(`/private_chat/${friendId}`)
  }

  render(){
    const {privateMessageNotifications} = this.props

    const displayOnlineUsers = ()=>{
      return this.props.onlineUsers.map(user=>{
        return (
          <li onClick={e=>this.handleClickedUser(user.id)}>
            <img src={user.profilePicUrl}/>
            <h3 className="online-name">{user.first} {user.last}</h3>
            {privateMessageNotifications.indexOf(user.id)>-1 && <div className="online-notification"></div>}
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </li>
        )
      })
    }

    return (
      <div className="online container-margin">
        <h1>Online Community</h1>
        <ul>
          {this.props.onlineUsers && displayOnlineUsers(this.props.onlineUsers)}
        </ul>
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
