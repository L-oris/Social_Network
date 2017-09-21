import React,{Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import {connect} from 'react-redux'
import getSocket from '../socket'

class Chat extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    this.newMessage.addEventListener('keydown',e=>{
      if(e.keyCode===13 && e.target.value){
        e.preventDefault()
        getSocket().emit('chatMessage',e.target.value)
        e.target.value = ''
      }
    })
  }

  render(){
    const renderChatMessages = () => this.props.chatMessages.map(message=>{
      return (
        <li className="post">
          <Link to={`/user/${message.user_id}`}>
            <h4 className="post-name">#{message.first} {message.last}</h4>
          </Link>
          {/* <img className="small-deleteme" src={message.profilePicUrl}/> */}
          <h5 className="post-text">{message.message}</h5>
          <h6 className="post-timestamp">{moment(message.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</h6>
        </li>
      )
    })
    return (
      <div className="chat container-margin">

        <h1>Slipperz Table!</h1>

        <div className="chat-create">
          <input name="newMessage" ref={newMessage=>this.newMessage=newMessage}></input>
          <h4>Publish your post!</h4>
        </div>

        <ul>
          {this.props.chatMessages && renderChatMessages()}
        </ul>

      </div>
    )
  }
}

function mapStateToProps(reduxState){
  return {
    chatMessages: reduxState.chatMessages && reduxState.chatMessages.reverse()
  }
}

export default connect(mapStateToProps)(Chat)
