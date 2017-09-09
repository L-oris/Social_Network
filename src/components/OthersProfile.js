import React,{Component} from 'react'
import axios from '../axios'

//React Components
import ProfilePic from './ProfilePic'

export default class OthersProfile extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    const {id} = this.props.params
    axios.get(`/api/getUser/${id}`)
    .then(function(serverResponse){
      console.log('RESPONSE RECEIVED!',serverResponse);
    })
    .catch(function(err){
      console.log('error happened',err.response);
    })
  }

  render(){
    return (
      <div>
        <h1>User's profile here</h1>
        {/* <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl}/>
        <h4>{first} {last}</h4>
        <h4>Bio here {bio}</h4> */}
      </div>
    )
  }

}
