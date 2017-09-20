import React,{Component} from 'react'
import {connect} from 'react-redux'
import getSocket from '../socket'

class PrivateChat extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  handlMessageChange(e){
    this.setState({
      newMessage: e.target.value
    })
  }

  handleMessageSubmit(e){
    const {friendId} = this.props
    const {newMessage} = this.state
    newMessage && getSocket().emit('privateMessage',{
      friendId, newMessage
    })
  }

  render(){
    const {privateMessages,friendId} = this.props
    const renderChatMessages = (messages)=>{
      return messages[friendId] && messages[friendId].map(message=>{
        let appliedStyle
        message.ownMessage ? appliedStyle='text-info' : appliedStyle='text-error'
        return (
          <li>
            <div className={appliedStyle}>
              <p>{message.message}</p>
            </div>
          </li>
        )
      })
    }

    const messageEditor = <div>
      <textarea onChange={e=>this.handlMessageChange(e)}></textarea>
      <button onClick={e=>this.handleMessageSubmit(e)}>Send</button>
    </div>

    return (
      <div>
        Here's the PrivateChat component
        {privateMessages && renderChatMessages(privateMessages)}
        {privateMessages && messageEditor}
      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    privateMessages: reduxState.privateMessages
  }
}

export default connect(mapStateToProps)(PrivateChat)
