import React from 'react'
import ReactDOM from 'react-dom'
import {hashHistory,Router,Route,IndexRedirect} from 'react-router'

//React Components
import Welcome from './components/Welcome'
import Registration from './components/Registration'
import Login from './components/Login'
import App from './components/App'

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

//rely on server-side session to know if user is registered-logged in, and display React components based on that
let componentToRender
location.pathname === '/welcome' ? componentToRender = welcomeRouter : componentToRender = <App/>

ReactDOM.render(
  componentToRender,
  document.querySelector('main')
)
