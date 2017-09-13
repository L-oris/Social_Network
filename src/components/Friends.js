import React,{Component} from 'react'
import {connect} from 'react-redux'
import {getFriends} from '../actions'

class Friends extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    this.props.dispatch(getFriends())
  }

  render(){
    const {friends} = this.props
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

function mapStateToProps(state){
  return {
    friends: state.friends
  }
}

export default connect(mapStateToProps)(Friends)
