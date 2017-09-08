import React from 'react'
import ReactDOM from 'react-dom'
import {hashHistory,browserHistory,Router,Route,IndexRoute} from 'react-router'

//React Components
import Welcome from './components/Welcome'
import Registration from './components/Registration'
import Login from './components/Login'
import App from './components/App'
import Profile from './components/Profile'
import OthersProfile from './components/OthersProfile'

//client-side routing for non-registered users
const welcomeRouter = (
  <Router history={hashHistory}>
    <Route path="/" component={Welcome}>
      <IndexRoute component={Registration}/>
      <Route path="login" component={Login}/>
    </Route>
  </Router>
)

//client-side routing for logged-in users
const loggedInRouter = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Profile}/>
      <Route path="user/:id" component={OthersProfile}/>
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
