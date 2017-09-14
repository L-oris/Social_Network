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

  componentDidMount(){
    this.componentWillReceiveProps()
  }

  componentWillReceiveProps(){
    const {id} = this.props.params
    axios.get(`/api/get_user/${id}`)
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

  render(){
    const {first,last,profilePicUrl,bio} = this.state
    return (
      <div className="others">
        <h1>User's profile here</h1>
        <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl}/>
        <h4>{first} {last}</h4>
        <h4>Bio here {bio}</h4>
        <FriendshipButton id={this.props.params.id}/>
      </div>
    )
  }

}
