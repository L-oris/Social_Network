import React,{Component} from 'react'
import axios from '../axios'

//React Components
import ProfilePic from './ProfilePic'
import EditableBio from './EditableBio'

export default function Profile (props){
  const {first,last,profilePicUrl,bio} = props
  return (
    <div className="profile container-padding">
      <h1 className="profile-name">{first} {last}</h1>
      <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl}/>
      <EditableBio bio={bio}/>
    </div>
  )
}
