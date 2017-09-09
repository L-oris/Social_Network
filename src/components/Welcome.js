import React from 'react'
import {Link} from 'react-router'

//React Components
import Logo from './Logo'

export default function Welcome(props){
  return (
    <div>
      <h1>Welcome to</h1>
      <Logo/>
      <h5>We are rebelling because all other online communities are revolting.</h5>
      <h3>Join the rebellion!</h3>

      {props.children}

    </div>
  )

}
