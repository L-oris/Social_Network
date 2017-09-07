import React,{Component} from 'react'
import axios from 'axios'

//React Components
import Logo from './Logo'

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
    return (
      <div>
        <Logo/>
        <div>Hi there from App component</div>

        {this.props.children}

      </div>
    )
  }

}
