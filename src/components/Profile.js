import React from 'react'

//React Components
import ProfilePic from './ProfilePic'

export default function Profile ({first,last,profilePicUrl,bio}){
  return (
    <div>
      <h1>User's profile here</h1>
      <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl}/>
      <h4>{first} {last}</h4>
      <h4>Bio here {bio}</h4>
    </div>
  )
}
