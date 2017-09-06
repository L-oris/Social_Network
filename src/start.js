import React from 'react'
import ReactDOM from 'react-dom'

//React Components
import Welcome from './Welcome'
import Logo from './Logo'

//rely on server-side session to know if user is registered or logged in, and display components based on that
let componentToRender
location.pathname === '/welcome' ? componentToRender = <Welcome/> : componentToRender = <Logo/>

ReactDOM.render(
  componentToRender,
  document.querySelector('main')
)
