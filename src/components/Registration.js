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
    e.preventDefault()
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
        <form onSubmit={e=>this.handleSubmit(e)} className="form">
          <h4 className="form-error">{this.state.error}</h4>

          <div className="form-field">
            <h6 className="form-field-title">First Name</h6>
            <input required name="first" onChange={e=>this.handleInputChange(e)} placeholder="First Name" className="form-field-input"/>
          </div>

          <div className="form-field">
            <h6 className="form-field-title">Last Name</h6>
            <input required name="last" onChange={e=>this.handleInputChange(e)} placeholder="Last Name" className="form-field-input"/>
          </div>

          <div className="form-field">
            <h6 className="form-field-title">Email</h6>
            <input required type="email" name="email" onChange={e=>this.handleInputChange(e)} placeholder="Email" className="form-field-input"/>
          </div>

          <div className="form-field">
            <h6 className="form-field-title">Password</h6>
            <input required type="password" name="password" onChange={e=>this.handleInputChange(e)} placeholder="Password" className="form-field-input"/>
          </div>

          <button type="submit" className="form-submit">Submit</button>
        </form>

        <Link to='/login' className="link">Login</Link>
      </div>
    )
  }

}
