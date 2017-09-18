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
import Friends from './components/Friends'
import SearchedFriends from './components/SearchedFriends'
import Online from './components/Online'
import Chat from './components/Chat'
import NotFound from './components/NotFound'

//Redux
import {createStore,applyMiddleware} from 'redux'
import reduxPromise from 'redux-promise'
import {composeWithDevTools} from 'redux-devtools-extension'
import {Provider} from 'react-redux'
import reducer from './reducer'

export const store = createStore(reducer,composeWithDevTools(applyMiddleware(reduxPromise)))

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
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Profile}/>
        <Route path="user/:id" component={OthersProfile}/>
        <Route path="friends" component={Friends}/>
        <Route path="search" component={SearchedFriends}/>
        <Route path="online" component={Online}/>
        <Route path="chat" component={Chat}/>
        <Route path="*" component={NotFound}/>
      </Route>
    </Router>
  </Provider>
)

//rely on server-side session to know if user is registered-logged in, and display React components based on that
let routerToRender
location.pathname === '/welcome' ? routerToRender = welcomeRouter : routerToRender = loggedInRouter

ReactDOM.render(
  routerToRender,
  document.querySelector('main')
)
