import React from 'react';

export default class Registration extends React.Component {

  render(){
    return (
      <div>
        <input name="first" placeholder="First Name"/>
        <input name="last" placeholder="Last Name"/>
        <input name="email" placeholder="Email"/>
        <input name="password" placeholder="Password"/>
        <button>Submit</button>
      </div>
    )
  }

}
