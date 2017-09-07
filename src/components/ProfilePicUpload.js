import React from 'react';

export default ({uploadUserPic,closeUploader})=>{
  return (
    <div className="uploader-overlay">
      <div className="uploader-container">
        <h3 onClick={closeUploader}>X</h3>
        <h4>Want to change your image?</h4>
        <input type="file" onChange={uploadUserPic} name="uploadImage" id="file-input"/>
      </div>
    </div>
  )
}
