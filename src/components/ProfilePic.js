import React from 'react';

export default ({profilePicUrl,first,last,showUploader})=>{
  return (
    <div onClick={showUploader}>
      <img src={profilePicUrl} alt={first + ' ' + last} className="nav-user"/>
    </div>
  )
}
