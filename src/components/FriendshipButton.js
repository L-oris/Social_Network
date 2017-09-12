import React,{Component} from 'react'
import axios from '../axios'

export default class FriendshipButton extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    const {id} = this.props
    axios.get(`/api/getUserFriendship/${id}`)
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
    })
    .catch((err)=>{
      console.log('error happened');
    })
  }

  handleFriendshipGo(e){
    axios.post('/api/friend_go',{id:this.props.id})
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
    })
    .catch((err)=>{
      console.log('error happened');
    })
  }

  handleFriendshipStop(e){
    axios.post('/api/friend_stop',{id:this.props.id})
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
    })
    .catch((err)=>{
      console.log('error happened');
    })
  }

  mapButtonStateToString(buttonState){
    const obj = {
      PENDING: 'Ask for friendship!',
      CANCEL: 'Delete your request',
      REJECT: 'Reject friendship request',
      ACCEPT: 'Accept friendship request',
      TERMINATE: 'End your friendship'
    }
    return obj[buttonState]
  }

  render(){
    const {nextGoStatus,nextStopStatus} = this.state
    return (
      <div>

        {nextGoStatus && <button onClick={e=>this.handleFriendshipGo(e)}>{this.mapButtonStateToString(nextGoStatus)}</button>}

        {nextStopStatus && <button onClick={e=>this.handleFriendshipStop(e)}>{this.mapButtonStateToString(nextStopStatus)}</button>}

      </div>
    )
  }

}
