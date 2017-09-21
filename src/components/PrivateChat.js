import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import {connect} from 'react-redux'
import {store} from '../start'
import getSocket from '../socket'
import {removePrivateMessageNotification} from '../actions'


class PrivateChat extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidUpdate(){
    document.body.scrollTop += 1000;
  }

  componentWillReceiveProps(){
    //eventually remove notifications about new private chat message coming in
    const {privateMessageNotifications,params:{id:friendId}} = this.props
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
    const friendId = this.props.params.id
    const {newMessage} = this.state
    newMessage && getSocket().emit('privateMessage',{
      friendId, newMessage
    })
    //clear input
    this.textArea.value = ''
  }

  render(){
    const {privateMessages,params:{id:friendId}} = this.props

    const renderChatMessages = (messages)=>{
      return messages[friendId] && messages[friendId].map(message=>{
        let appliedStyle
        message.ownMessage ? appliedStyle='private_chat-msg private_chat-msg--own' : appliedStyle='private_chat-msg private_chat-msg--friend'
        return (
          <li className={appliedStyle}>
            <p>{message.message}</p>
            <h6>{moment(message.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</h6>
          </li>
        )
      })
    }

    const messageEditor = <div className="private_chat-editor">
      <textarea ref={el=>this.textArea=el} onChange={e=>this.handleMessageChange(e)}></textarea>
      <button onClick={e=>this.handleMessageSubmit(e)}>
        <i className="fa fa-paper-plane" aria-hidden="true"></i>
      </button>
    </div>

    return (
      <div className="private_chat container-margin">

        <ul>
          {privateMessages && renderChatMessages(privateMessages)}
        </ul>

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
