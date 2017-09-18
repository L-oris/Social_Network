import React,{Component} from 'react'
import {connect} from 'react-redux'
import getSocket from '../socket'

class Chat extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    this.newMessage.addEventListener('keydown',e=>{
      if(e.keyCode===13){
        e.preventDefault()
        getSocket().emit('chatMessage',e.target.value)
        e.target.value = ''
      }
    })
  }

  render(){
    const renderChatMessages = () => this.props.chatMessages.map(message=>{
      return (
        <li>
          <h6>{message.first} {message.last}</h6>
          <img src={message.profilePicUrl}/>
          <p>{message.text}</p>
          <p>{message.time}</p>
        </li>
      )
    })
    return (
      <div className="container-margin">
        <h1>Here below should be displayed chat messages</h1>
        {this.props.chatMessages && renderChatMessages()}
        <h4>Send a new message!</h4>
        <textarea name="newMessage" ref={newMessage=>this.newMessage=newMessage}></textarea>
      </div>
    )
  }
}

function mapStateToProps(reduxState){
  return {
    chatMessages: reduxState.chatMessages
  }
}

export default connect(mapStateToProps)(Chat)
