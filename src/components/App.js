import React,{Component} from 'react'
import axios from 'axios'

//React Components
import Logo from './Logo'

export default class App extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    return (
      <div>
        <Logo/>
        <div>Hi there from App component</div>

        {this.props.children}

      </div>
    )
  }

}
