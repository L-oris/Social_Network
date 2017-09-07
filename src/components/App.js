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

  render(){
    const {error,uploaderIsVisible,first,last,profilePicUrl} = this.state
    return (
      <div>
        {uploaderIsVisible && <ProfilePicUpload/>}
        <nav className="nav">
          <Logo/>
          <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl} showUploader={e => this.showUploader(e)}/>
        </nav>
        <h4 className="text-error">{error}</h4>
        <div>Hi there from App component</div>

        {this.props.children}

      </div>
    )
  }

}
