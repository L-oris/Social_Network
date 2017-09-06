import React from 'react'
import {Link} from 'react-router'

export default function(props){

  return (
    <div>
      <h1>Welcome to Munity</h1>
      <h5>We are rebelling because all other online communities are revolting.</h5>
      <h3>Join the rebellion!</h3>

      {props.children}

    </div>
  )
  
}
