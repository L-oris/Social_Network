import React from 'react'
import ReactDOM from 'react-dom'
import {hashHistory,Router,Route,IndexRedirect} from 'react-router'

//React Components
import Welcome from './components/Welcome'
import Registration from './components/Registration'
import Login from './components/Login'
import App from './components/App'
import UserInfo from './components/UserInfo'

//client-side routing for non-registered users
const welcomeRouter = (
  <Router history={hashHistory}>
    <Route path="/" component={Welcome}>
      <IndexRedirect to="/register"/>
      <Route path="/register" component={Registration}/>
      <Route path="/login" component={Login}/>
    </Route>
  </Router>
)

//client-side routing for logged-in users
const loggedInRouter = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="/user" component={UserInfo}/>
    </Route>
  </Router>
)

//rely on server-side session to know if user is registered-logged in, and display React components based on that
let routerToRender
location.pathname === '/welcome' ? routerToRender = welcomeRouter : routerToRender = loggedInRouter

ReactDOM.render(
  routerToRender,
  document.querySelector('main')
)
