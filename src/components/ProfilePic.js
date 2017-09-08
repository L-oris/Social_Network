import React from 'react';

export default ({first,last,profilePicUrl,showUploader})=>{
  return (
    <div onClick={showUploader}>
      <img src={profilePicUrl} alt={first + ' ' + last} className="nav-user"/>
    </div>
  )
}
