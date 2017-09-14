import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

function SearchedFriends(props){
  const friendsList = props.friends && props.friends.map(friend=>{
    return (
      <li>
        <Link to={`/user/${friend.id}`}>
          <h5>{friend.first} {friend.last}</h5>
          <img className="small-deleteme" src={friend.profilePicUrl} alt={friend.first+' '+friend.last}/>
        </Link>
      </li>
    )
  })
  return (
    <div>
      {friendsList}
    </div>
  )
}


function mapStateToProps(reduxState){
  return {
    friends: reduxState.searchedFriendsList
  }
}

export default connect(mapStateToProps)(SearchedFriends)
