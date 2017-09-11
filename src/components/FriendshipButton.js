import React,{Component} from 'react'
import axios from '../axios'

export default class FriendshipButton extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    const {id} = this.props
    axios.get(`/api/getUserFriendship/${id}`)
    .then((serverResponse)=>{
      console.log('received!',serverResponse);
    })
    .catch((err)=>{
      console.log('error happened');
    })
  }

  handleFriendshipGo(e){
    console.log('button clicked');
  }

  handleFriendshipStop(e){
    console.log('button clicked');
  }

  render(){
    const {friendshipGo,friendshipStop} = this.state
    return (
      <div>

        {friendshipGo && <button onClick={e=>this.handleFriendshipGo(e)}>{friendshipGo}</button>}

        {friendshipStop && <button onClick={e=>this.handleFriendshipStop(e)}>{friendshipStop}</button>}

      </div>
    )
  }

}
