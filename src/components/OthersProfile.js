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
    axios.post('/api/search_user_by_id',{id})
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
      <div className="others container-padding">
        <h1 className="profile-name">{first} {last}</h1>
        <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl}/>
        <div className="bio">
          <h4 className="bio-text">{bio}</h4>
        </div>
        <FriendshipButton id={this.props.params.id}/>
      </div>
    )
  }

}
