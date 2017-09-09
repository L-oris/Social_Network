import React,{Component} from 'react'
import axios from '../axios'

//React Components
import ProfilePic from './ProfilePic'

export default class Profile extends Component {

  constructor(props){
    super(props)
    this.state = {
      bio: this.props.bio
    }
  }

  showBio(){
    this.setState({
      editBioIsVisible: false
    })
  }

  editBio(){
    this.setState({
      editBioIsVisible: true
    })
  }

  handleChangeBio(e){
    this.setState({
      editBioText: e.target.value
    })
  }

  handleSaveBio(){
    axios.put('/api/update_bio',{bio:this.state.editBioText})
    .then(function(serverResponse){
      console.log('bio updated!');
    })
    .catch(function(err){
      console.log('erro happened trying to update bio');
    })
  }

  render(){
    const {first,last,profilePicUrl,bio} = this.props

    const bioText = ()=>{
      if(!bio){
        return <p onClick={e=>this.editBio(e)} className="text-link">Add your bio now</p>
      }
      return <p>{bio} || <span onClick={e=>this.editBio(e)} className="text-link">Edit</span></p>
    }
    const bioInput = ()=>{
      return (
        <div>
          <textarea onChange={e=>this.handleChangeBio(e)} rows="4" cols="50">{this.state.bio}</textarea>
          <button onClick={e=>this.handleSaveBio(e)}>Save</button>
          <button onClick={e=>this.showBio(e)}>Return</button>
        </div>
      )
    }
    const bioRender =()=>{
      if(!this.state.editBioIsVisible){
        return bioText()
      }
      return bioInput()
    }

    return (
      <div>
        <h1>User's profile here</h1>
        <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl}/>
        <h4>{first} {last}</h4>
        {bioRender()}
      </div>
    )
  }

}
