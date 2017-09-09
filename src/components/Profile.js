import React,{Component} from 'react'
import axios from '../axios'

//React Components
import ProfilePic from './ProfilePic'

export default class Profile extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(props){
    this.setState({
      bio: props.bio
    })
  }

  editBioIsVisible(boolean){
    this.setState({
      editBioIsVisible: boolean
    })
  }

  handleChangeBio(e){
    this.setState({
      editBioText: e.target.value
    })
  }

  handleSaveBio(){
    this.editBioIsVisible(false)
    axios.put('/api/update_bio',{bio:this.state.editBioText})
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
    })
    .catch(function(err){
      console.log('error happened trying to update bio');
    })
  }

  render(){
    const {first,last,profilePicUrl} = this.props
    const {bio} = this.state

    const bioText = ()=>{
      if(!bio){
        return <p onClick={e=>this.editBioIsVisible(true)} className="text-link">Add your bio now</p>
      }
      return <p>{bio} || <span onClick={e=>this.editBioIsVisible(true)} className="text-link">Edit</span></p>
    }
    const bioInput = ()=>{
      return (
        <div>
          <textarea onChange={e=>this.handleChangeBio(e)} rows="4" cols="50">{bio}</textarea>
          <button onClick={e=>this.handleSaveBio(e)}>Save</button>
          <button onClick={e=>this.editBioIsVisible(false)}>Return</button>
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
