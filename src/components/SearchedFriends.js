import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

function SearchedFriends(props){
  const usersList = props.users && props.users.map(user=>{
    return (
      <li>
        <Link to={`/user/${user.id}`}>
          <h5>{user.first} {user.last}</h5>
          <img className="small-deleteme" src={user.profilePicUrl} alt={user.first+' '+user.last}/>
        </Link>
      </li>
    )
  })
  return (
    <div>
      {usersList}
    </div>
  )
}


function mapStateToProps(reduxState){
  return {
    users: reduxState.searchedUsersList
  }
}

export default connect(mapStateToProps)(SearchedFriends)
