import React,{Component} from 'react'
import axios from 'axios'

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
    axios.get('/getUser')
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

  removeInfo(){
    this.setState({
      info: null
    })
  }

  uploadUserPic(e){
    this.closeUploader()
    this.setInfo('Loading..')
    //use built-in FormData API
    const formData = new FormData()
    formData.append('file',e.target.files[0])
    axios.put('/upload_profile_pic',formData)
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
      this.removeInfo()
    })
    .catch((err)=>{
      this.setState({
        error: 'Something went wrong. Please try again!'
      })
    })
  }

  render(){
    const {error,info,uploaderIsVisible,first,last,profilePicUrl} = this.state
    return (
      <div>

        {uploaderIsVisible && <ProfilePicUpload uploadUserPic={e=>this.uploadUserPic(e)} closeUploader={e => this.closeUploader(e)}/>}

        <nav className="nav">
          <Logo/>
          <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl} showUploader={e => this.showUploader(e)}/>
        </nav>

        <h4 className="text-error">{error}</h4>
        <h4 className="text-info">{info}</h4>
        <div>Hi there from App component</div>

        {this.props.children}

      </div>
    )
  }

}
