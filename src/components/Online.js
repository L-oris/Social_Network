import React,{Component} from 'react'
import {connect} from 'react-redux'
import getSocket from '../socket'

//React components
import PrivateChat from './PrivateChat'

class Online extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  handleClickedUser(userId){
    getSocket().emit('privateMessages',{userId})
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
        <PrivateChat/>
      </div>
    )
  }

}

function mapStateToProps(reduxState){
  return {
    onlineUsers: reduxState.onlineUsers
  }
}

export default connect(mapStateToProps)(Online)
