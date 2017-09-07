import React from 'react';

export default (props)=>{
  return (
    <div className="uploader-overlay">
      <div className="uploader-container">
        <h4>Want to change your image?</h4>
        <div>
          <input type="file" name="uploadImage" id="file-input"/>
          <label for="file-input">Upload</label>
        </div>
      </div>
    </div>
  )
}
