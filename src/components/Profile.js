import React,{Component} from 'react'
import axios from '../axios'

//React Components
import ProfilePic from './ProfilePic'
import EditableBio from './EditableBio'

export default function Profile (props){
  const {first,last,profilePicUrl,bio} = props
  return (
    <div className="profile container-padding">
      <div className="profile-tab">
        <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl}/>
        <h1 className="profile-name">{first} {last}</h1>
        <EditableBio bio={bio}/>
      </div>
    </div>
  )
}
