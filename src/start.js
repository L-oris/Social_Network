import React from 'react'
import ReactDOM from 'react-dom'
import {Router,Route,IndexRoute,hashHistory} from 'react-router'

//React Components
import Welcome from './Welcome'
import Registration from './Registration'
import Login from './Login'
import Logo from './Logo'

//client-side routing for non-registered users
const welcomeRouter = (
  <Router history={hashHistory}>
    <Route path="/" component={Welcome}>
      <IndexRoute component={Registration}/>
      <Route path="/login" component={Login}/>
    </Route>
  </Router>
)

//rely on server-side session to know if user is registered-logged in, and display React components based on that
let componentToRender
location.pathname === '/welcome' ? componentToRender = welcomeRouter : componentToRender = <Logo/>

ReactDOM.render(
  componentToRender,
  document.querySelector('main')
)
