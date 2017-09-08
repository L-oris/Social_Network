import React from 'react'
import axios from 'axios'

export default function(Component,url){

  return class FormWrapper extends React.Component {

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
      e.preventDefault()
      axios.post(url,this.state)
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
              error={this.state.error}
              handleInputChange={e=>this.handleInputChange(e)}
              handleSubmit={e=>this.handleSubmit(e)}/>
    }

  }
}
