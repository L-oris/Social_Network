import React,{Component} from 'react'
import axios from '../axios'

export default class Friends extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    axios.get('/api/getFriends')
    .then((serverResponse)=>{
      this.setState({
        friends:serverResponse.data
      })
    })
    .catch((err)=>{
      console.log('Error happened!',err);
    })
  }

  render(){
    const {friends} = this.state
    const renderPendingFriends = ()=>{
      return friends.map(friend=>{
        return friend.status==='PENDING' && (
          <li>
            <p>{friend.first} {friend.last}</p>
            <img className="small-deleteme" src={friend.profilePicUrl} alt={friend.first,' ',friend.last}/>
          </li>
        )
      })
    }
    const renderCurrentFriends = ()=>{
      return friends.map(friend=>{
        return friend.status==='ACCEPT' && (
          <li>
            <p>{friend.first} {friend.last}</p>
            <img className="small-deleteme" src={friend.profilePicUrl} alt={friend.first,' ',friend.last}/>
          </li>
        )
      })
    }

    return (
      <div>
        <h2>Pending friends</h2>
        <ul>
          {friends && renderPendingFriends()}
        </ul>
        <h2>Current friends</h2>
        <ul>
          {friends && renderCurrentFriends()}
        </ul>
      </div>
    )
  }

}
