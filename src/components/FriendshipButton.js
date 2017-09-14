import React,{Component} from 'react'
import axios from '../axios'

export default class FriendshipButton extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    const {id} = this.props
    axios.get(`/api/get_friendship_status/${id}`)
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
    })
    .catch((err)=>{
      this.setState({
        error: 'Friendship Button Error'
      })
    })
  }

  handleFriendshipGo(e){
    axios.post('/api/friendship_go',{id:this.props.id})
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
    })
    .catch((err)=>{
      this.setState({
        error: 'Friendship Button Error'
      })
    })
  }

  handleFriendshipStop(e){
    axios.post('/api/friendship_stop',{id:this.props.id})
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
    })
    .catch((err)=>{
      this.setState({
        error: 'Friendship Button Error'
      })
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
    const {error,nextGoStatus,nextStopStatus} = this.state
    return (
      <div>
        <h6 className="text-error">{error}</h6>

        {nextGoStatus && <button onClick={e=>this.handleFriendshipGo(e)}>{this.mapButtonStateToString(nextGoStatus)}</button>}

        {nextStopStatus && <button onClick={e=>this.handleFriendshipStop(e)}>{this.mapButtonStateToString(nextStopStatus)}</button>}

      </div>
    )
  }

}
