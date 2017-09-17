import React,{Component} from 'react'
import {Link,browserHistory} from 'react-router'
import axios from '../axios'
import {connect} from 'react-redux'
import {searchUserByName} from '../actions'
import getSocket from '../socket'

//React Components
import Logo from './Logo'
import ProfilePic from './ProfilePic'
import ProfilePicUpload from './ProfilePicUpload'

class App extends Component {

  constructor(props){
    super(props)
    getSocket()
    this.state = {}
  }

  componentDidMount(){
    axios.get('/api/get_current_user')
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

  deleteMessages(){
    this.setState({
      info: null,
      error: null
    })
  }

  handleSearchChange(e){
    this.setState({
      friendSearchInput: e.target.value
    })
  }

  handleSearchSubmit(e){
    const {friendSearchInput} = this.state
    if(friendSearchInput){
      this.props.dispatch(searchUserByName(friendSearchInput))
      this.setState({
        friendSearchInput: ''
      })
      //render results to user
      browserHistory.push('/search')
    }
  }

  uploadUserPic(e){
    this.closeUploader()
    this.setState({
      info: 'Loading..'
    })
    //use built-in FormData API
    const formData = new FormData()
    formData.append('file',e.target.files[0])
    axios.put('/api/upload_profile_pic',formData)
    .then((serverResponse)=>{
      this.setState(serverResponse.data)
      this.deleteMessages()
    })
    .catch((err)=>{
      this.setState({
        error: 'Something went wrong. Please try again'
      })
    })
  }

  render(){
    const {error,info,uploaderIsVisible,first,last,profilePicUrl,bio} = this.state
    //pass props to every children rendered inside <Route path="/" component={App}>..</Route>
    const children = React.cloneElement(this.props.children,{
      first, last, profilePicUrl, bio
    })

    return (
      <div className="app">

        {uploaderIsVisible && <ProfilePicUpload uploadUserPic={e=>this.uploadUserPic(e)} closeUploader={e=>this.closeUploader(e)}/>}

        <nav className="nav">
          <div className="nav-main container-padding">
            <div>
              <Logo/>
              <h1 className="nav-social_title">Slipperz</h1>
            </div>
            <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl} showUploader={e=>this.showUploader(e)}/>
          </div>

          <div className="nav-sub">
            <Link className="nav-sub-link" to="/friends">
              <i className="fa fa-users" aria-hidden="true"></i>
              <h5>FRIENDS</h5>
            </Link>
            <Link className="nav-sub-link" to="/online">
              <i className="fa fa-plug" aria-hidden="true"></i>
              <h5>ONLINE</h5>
            </Link>
            <a className="nav-sub-link" href="/api/logout">
              <i className="fa fa-sign-out" aria-hidden="true"></i>
              <h5>LOGOUT</h5>
            </a>
          </div>
        </nav>

        <div className="main-content">
          <h4 className="text-error">{error}</h4>
          <h4 className="text-info">{info}</h4>

          <div>
            <input type="text" name="friendSearchInput" value={this.state.friendSearchInput} placeholder="Marge" onChange={e=>this.handleSearchChange(e)}/>
            <button onClick={e=>this.handleSearchSubmit(e)}>Search!</button>
          </div>


          {children}
        </div>
      </div>
    )
  }

}


function mapStateToProps(reduxState){
  return {}
}

export default connect(mapStateToProps)(App)
