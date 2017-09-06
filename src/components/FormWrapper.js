import React, {Component} from 'react'
import {Link} from 'react-router'
import axios from 'axios'

export default function(Component,url){

  return class FormWrapper extends Component {

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
      return <Component
              error={this.error}
              handleInputChange={e => this.handleInputChange(e)}
              handleSubmit={e => this.handleSubmit(e)}/>
    }

  }
}
