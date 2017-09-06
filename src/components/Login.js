import React, {Component} from 'react'
import axios from 'axios'

export default class Login extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  handleInputChange(e){
    //update state with current value of <input>s
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e){
    const {email,password} = this.state
    if(!(email&&password)){
      return this.setState({
        error: 'All fields are required'
      })
    }
    axios.post('/login',this.state)
    .then(()=>{
      location.replace('/')
    })
    .catch((err)=>{
      return this.setState({
        error: 'Something went wrong. Please try again!'
      })
    })
  }

  render(){
    return (
      <div>
        <h4 className="text-error">{this.state.error}</h4>
        <input name="email" onChange={e=>this.handleInputChange(e)} placeholder="Email"/>
        <input name="password" onChange={e=>this.handleInputChange(e)} placeholder="Password"/>
        <button onClick={e=>this.handleSubmit(e)}>Submit</button>
      </div>
    )
  }

}
