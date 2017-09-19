import React,{Component} from 'react'
import {connect} from 'react-redux'
import getSocket from '../socket'

class PrivateChat extends Component {

  constructor(props){
    super(props)
    this.state = {}
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

    return (
      <div>
        Here's the PrivateChat component
        {privateMessages && renderChatMessages(privateMessages)}
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
