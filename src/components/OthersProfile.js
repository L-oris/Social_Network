import React,{Component} from 'react'
import {browserHistory} from 'react-router'
import axios from '../axios'

//React Components
import ProfilePic from './ProfilePic'
import FriendshipButton from './FriendshipButton'

export default class OthersProfile extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(){
    const {id} = this.props.params
    axios.get(`/api/getUser/${id}`)
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
    })
    .catch((err)=>{
      if(err.response.status===301){
        //redirect user to home when trying to get his data
        return browserHistory.push('/')
      }
      browserHistory.push('/not_found')
    })
  }

  handleFriendshipGo(e){
    console.log('button clicked');
  }

  handleFriendshipStop(e){
    console.log('button clicked');
  }

  render(){
    const {first,last,profilePicUrl,bio} = this.state
    const {friendshipGo, friendshipStop} = this.state
    const renderFriendshipButton = ()=>{
      let htmlFriendshipButton
      if(friendshipGo){
        htmlFriendshipButton += <button onClick={e=>this.handleFriendshipGo(e)}>{friendshipGo}</button>
      }
      if(friendshipStop){
        htmlFriendshipButton += <button onClick={e=>this.handleFriendshipStop(e)}>{friendshipStop}</button>
      }
      return htmlFriendshipButton
    }

    return (
      <div>
        <h1>User's profile here</h1>
        <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl}/>
        <h4>{first} {last}</h4>
        <h4>Bio here {bio}</h4>
        <FriendshipButton friendshipGo={friendshipGo} friendshipStop={friendshipStop} handleFriendshipGo={e=>this.handleFriendshipGo(e)} handleFriendshipStop={e=>this.handleFriendshipStop(e)}/>
      </div>
    )
  }

}
