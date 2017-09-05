import React from 'react'
import ReactDOM from 'react-dom'

//React Components
import Welcome from './Welcome'
import Logo from './Logo'

//render different component based on url changes
let componentToRender
location.pathname === '/welcome' ? componentToRender = <Welcome/> : componentToRender = <Logo/>

ReactDOM.render(
  componentToRender,
  document.querySelector('main')
)
