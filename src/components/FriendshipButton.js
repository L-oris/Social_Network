import React,{Component} from 'react'

export default class FriendshipButton extends Component {

  constructor(props){
    super(props)
    this.state = {}
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
