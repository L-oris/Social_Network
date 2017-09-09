import React,{Component} from 'react'
import axios from '../axios'

//React Components
import ProfilePic from './ProfilePic'
import EditableBio from './EditableBio'

export default function Profile (props){
  const {first,last,profilePicUrl,bio} = props
  return (
    <div>
      <h1>User's profile here</h1>
      <ProfilePic first={first} last={last} profilePicUrl={profilePicUrl}/>
      <h4>{first} {last}</h4>
      <EditableBio bio={bio}/>
    </div>
  )
}
