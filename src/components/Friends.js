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
          <li>
            <Link to={`/user/${friend.id}`}>
              <p>{friend.first} {friend.last}</p>
              <img className="small-deleteme" src={friend.profilePicUrl} alt={friend.first,' ',friend.last}/>
              <button onClick={()=>dispatch(acceptFriendship(friend.id))}>Accept friendship</button>
            </Link>
          </li>
        )
      })
    }
    const renderCurrentFriends = ()=>{
      return friends.map(friend=>{
        return friend.status==='ACCEPT' && (
          <li>
            <Link to={`/user/${friend.id}`}>
              <p>{friend.first} {friend.last}</p>
              <img className="small-deleteme" src={friend.profilePicUrl} alt={friend.first,' ',friend.last}/>
              <button onClick={()=>dispatch(removeFriendship(friend.id))}>End this friendship</button>
          </Link>
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

function mapStateToProps(reduxState){
  return {
    friends: reduxState.friends
  }
}

export default connect(mapStateToProps)(Friends)
