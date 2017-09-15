import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

function SearchedFriends(props){
  const usersList = props.users && props.users.map(user=>{
    return (
      <li className="srced_friends-item">
        <Link to={`/user/${user.id}`}>
        <img src={user.profilePicUrl} alt={user.first+' '+user.last}/>
        <div className="srced_friends-item-text">
          <h4 className="srced_friends-item-name">{user.first} {user.last}</h4>
          <p className="srced_friends-item-bio">{user.bio}</p>
        </div>
        </Link>
      </li>
    )
  })
  return (
    <ul className='srced_friends container-margin'>
      {usersList}
    </ul>
  )
}


function mapStateToProps(reduxState){
  return {
    users: reduxState.searchedUsersList
  }
}

export default connect(mapStateToProps)(SearchedFriends)
