import React from 'react';

export default class Registration extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      first: null,
      last: null,
      email: null,
      password: null
    }
  }

  handleInputChange(e){
    console.log('input changed');
  }

  handleSubmit(e){
    console.log('button clicked')
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
