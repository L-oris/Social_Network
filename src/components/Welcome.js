import React from 'react'
import {Link} from 'react-router'

//React Components
import Logo from './Logo'

export default function Welcome(props){
  return (
    <div className="welcome">
      <Logo/>
      <h1 className="welcome-title">Slipperz</h1>
      <h5 className="welcome-intro">We are rebelling because all other online communities are revolting.</h5>
      <h4 className="welcome-community">Join the rebellion!</h4>

      {props.children}

    </div>
  )

}
