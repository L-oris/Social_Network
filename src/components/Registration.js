import React, {Component} from 'react'
import {Link} from 'react-router'
import axios from 'axios'

export default class Registration extends Component {

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
      return this.setState({
        error: 'All fields are required'
      })
    }
    axios.post('/register',this.state)
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
        <div className="form">
          <h4 className="form-error">{this.state.error}</h4>

          <div className="form-field">
            <h6 className="form-field-title">First Name</h6>
            <input name="first" onChange={e=>this.handleInputChange(e)} placeholder="First Name" className="form-field-input"/>
          </div>

          <div className="form-field">
            <h6 className="form-field-title">Last Name</h6>
            <input name="last" onChange={e=>this.handleInputChange(e)} placeholder="Last Name" className="form-field-input"/>
          </div>

          <div className="form-field">
            <h6 className="form-field-title">Email</h6>
            <input name="password" onChange={e=>this.handleInputChange(e)} placeholder="Password" className="form-field-input"/>
          </div>

          <div className="form-field">
            <h6 className="form-field-title">Password</h6>
            <input name="password" onChange={e=>this.handleInputChange(e)} placeholder="Password" className="form-field-input"/>
          </div>

          <button onClick={e=>this.handleSubmit(e)} className="form-submit">Submit</button>
        </div>

        <Link to='/login' className="link">Login</Link>
      </div>
    )
  }

}
