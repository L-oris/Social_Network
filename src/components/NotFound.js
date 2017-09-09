import React from 'react'
import {Link} from 'react-router'

export default function NotFound (props){
  return (
    <div>
      <h1>Sorry Page Not Found</h1>
      <Link to='/'>Please Return Home</Link>
    </div>
  )
}
