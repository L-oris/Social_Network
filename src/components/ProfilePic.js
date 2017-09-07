import React from 'react';

export default ({profilePicUrl,first,last})=>{
  return (
    <div>
      <img src={profilePicUrl} alt={first + ' ' + last} className="nav-user"/>
    </div>
  )
}
