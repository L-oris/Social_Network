import React,{Component} from 'react'
import {connect} from 'react-redux'
import getSocket from '../socket'

class PrivateChat extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    return (
      <div>
        Here's the PrivateChat component
      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {}
}

export default connect(mapStateToProps)(PrivateChat)
