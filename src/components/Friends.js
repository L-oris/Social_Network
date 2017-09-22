import React,{Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {getFriends,acceptFriendship,removeFriendship} from '../actions'

class Friends extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    this.props.dispatch(getFriends())
  }

  render(){
    const {dispatch,friends} = this.props

    const renderPendingFriends = ()=>{
      return friends.map(friend=>{
        return friend.status==='PENDING' && (
          <li className="friends-item friends-item_pending">
            <Link to={`/user/${friend.id}`}>
              <p className="friends-item-name">{friend.first} {friend.last}</p>
            </Link>
            <div className="friends-item-pic">
              <img src={friend.profilePicUrl} alt={friend.first,' ',friend.last}/>
              <button onClick={()=>dispatch(acceptFriendship(friend.id))}>Accept friendship</button>
            </div>
          </li>
        )
      })
    }

    const renderCurrentFriends = ()=>{
      return friends.map(friend=>{
        return friend.status==='ACCEPT' && (
          <li className="friends-item friends-item_current">
            <Link to={`/user/${friend.id}`}>
              <p className="friends-item-name">{friend.first} {friend.last}</p>
            </Link>
            <div className="friends-item-pic">
              <img src={friend.profilePicUrl}  alt={friend.first,' ',friend.last}/>
              <button onClick={()=>dispatch(removeFriendship(friend.id))}>End this friendship</button>
            </div>
          </li>
        )
      })
    }

    return (
      <div className="friends container-margin">
        <h1 className="friends-title">Follow the Sleeperz!</h1>
        <ul className="friends-items">
          {friends && renderPendingFriends()}
          {friends && renderCurrentFriends()}
        </ul>
      </div>
    )
  }

}

function mapStateToProps(reduxState){
  return {
    friends: reduxState.friends
  }
}

export default connect(mapStateToProps)(Friends)
