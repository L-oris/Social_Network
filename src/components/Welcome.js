import React from 'react'
import {Link} from 'react-router'

//React Components
import Logo from './Logo'

export default function Welcome(props){
  return (
    <div className="welcome container-margin">
      <Logo/>
      <h1 className="welcome-title" id="title">Slipperz</h1>
      <h5 className="welcome-intro">The social community of people that have no reasons for moving away from home.<br/><span className="welcome-community">Be part of us!</span></h5>

      {props.children}

    </div>
  )

}
