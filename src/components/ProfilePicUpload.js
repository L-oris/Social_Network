import React from 'react'

export default function ProfilePicUpload({uploadUserPic,closeUploader}){
  return (
    <div className="uploader-overlay">
      <img src="/images/homer-sleep.png"/>
      <div className="uploader-container">
        <h3 onClick={closeUploader} className="uploader-close_button">X</h3>
        <h3 className="uploader-title">Want to change your image?</h3>
        <input type="file" onChange={uploadUserPic} name="uploadImage" id="file-input"/>
        <label htmlFor="file-input">Choose a file</label>
      </div>
    </div>
  )
}
