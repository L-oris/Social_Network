import React from 'react'
import axios from 'axios'

export default class Registration extends React.Component {

  constructor(props){
    super(props)
    //initial state
    this.state = {}
  }

  handleInputChange(e){
    //update state with current value of <input>s
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e){
    const {first,last,email,password} = this.state
    if(!(first&&last&&email&&password)){
      console.log('fields are not filled');
      return;
    }
    axios.post('/register',this.state)
    .then(function(){
      location.replace('/')
    })
    .catch(function(err){
      console.log('something went wrong');
    })
  }

  render(){
    return (
      <div>
        <input name="first" onChange={e=>this.handleInputChange(e)} placeholder="First Name"/>
        <input name="last" onChange={e=>this.handleInputChange(e)} placeholder="Last Name"/>
        <input name="email" onChange={e=>this.handleInputChange(e)} placeholder="Email"/>
        <input name="password" onChange={e=>this.handleInputChange(e)} placeholder="Password"/>
        <button onClick={e=>this.handleSubmit(e)}>Submit</button>
      </div>
    )
  }

}
