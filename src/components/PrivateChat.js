import React,{Component} from 'react'
import {connect} from 'react-redux'
import {store} from '../start'
import getSocket from '../socket'
import {removePrivateMessageNotification} from '../actions'


class PrivateChat extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(){
    //eventually remove notifications about new private chat message coming in
    const {friendId,privateMessageNotifications} = this.props
    if(privateMessageNotifications && privateMessageNotifications.indexOf(friendId)>-1){
      store.dispatch(removePrivateMessageNotification(friendId))
    }
  }

  handleMessageChange(e){
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
      <textarea onChange={e=>this.handleMessageChange(e)}></textarea>
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
    privateMessages: reduxState.privateMessages,
    privateMessageNotifications: reduxState.privateMessageNotifications
  }
}

export default connect(mapStateToProps)(PrivateChat)
