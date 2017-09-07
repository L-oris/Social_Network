import React,{Component} from 'react'
import axios from 'axios'

//React Components
import Logo from './Logo'
import ProfilePic from './ProfilePic'

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

  render(){
    const {first,last,profilePicUrl} = this.state
    return (
      <div>
        <nav className="nav">
          <Logo/>
          <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl}/>
        </nav>
        <div>Hi there from App component</div>

        {this.props.children}

      </div>
    )
  }

}
