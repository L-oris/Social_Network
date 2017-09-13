import React,{Component} from 'react'
import axios from '../axios'

export default class Friends extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    axios.get('/api/getFriends')
    .then(function(serverResponse){
      console.log('Response successful!',serverResponse);
    })
    .catch(function(err){
      console.log('Error happened!',err);
    })
  }

  render(){
    return (
      <h1>Here's friends!!</h1>
    )
  }

}
