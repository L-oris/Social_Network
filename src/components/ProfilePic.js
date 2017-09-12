import React from 'react'

export default function ProfilePic ({first,last,profilePicUrl,showUploader}){
  return (
    <div onClick={showUploader} className="user_pic">
      <img src={profilePicUrl} alt={first + ' ' + last} className="user_pic-img"/>
    </div>
  )
}
