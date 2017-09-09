import React,{Component} from 'react'
import {Link} from 'react-router'
import axios from '../axios'

//React Components
import Logo from './Logo'
import ProfilePic from './ProfilePic'
import ProfilePicUpload from './ProfilePicUpload'

export default class App extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    axios.get('/api/getUser')
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
    })
    .catch((err)=>{
      this.setState({
        error: 'Something went wrong. Please try again!'
      })
    })
  }

  showUploader(){
    this.setState({
      uploaderIsVisible: true
    })
  }

  closeUploader(){
    this.setState({
      uploaderIsVisible: false
    })
  }

  setInfo(newMessage){
    this.setState({
      info: newMessage
    })
  }

  setError(newMessage){
    this.setState({
      error: newMessage
    })
  }

  deleteMessages(){
    this.setState({
      info: null,
      error: null
    })
  }

  uploadUserPic(e){
    this.closeUploader()
    this.setInfo('Loading..')
    //use built-in FormData API
    const formData = new FormData()
    formData.append('file',e.target.files[0])
    axios.put('/api/upload_profile_pic',formData)
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
      this.deleteMessages()
    })
    .catch((err)=>{
      setError('Something went wrong. Please try again!')
    })
  }

  render(){
    const {error,info,uploaderIsVisible,first,last,profilePicUrl,bio} = this.state
    //pass props to every children rendered inside <Route path="/" component={App}>..</Route>
    const children = React.cloneElement(this.props.children,{
      first, last, profilePicUrl, bio
    })

    return (
      <div>

        {uploaderIsVisible && <ProfilePicUpload uploadUserPic={e=>this.uploadUserPic(e)} closeUploader={e=>this.closeUploader(e)}/>}

        <nav className="nav">
          <Logo/>
          <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl} showUploader={e=>this.showUploader(e)}/>
        </nav>

        <h4 className="text-error">{error}</h4>
        <h4 className="text-info">{info}</h4>
        <div>Hi there from App component</div>

        {children}

      </div>
    )
  }

}
