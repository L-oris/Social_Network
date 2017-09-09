import React from 'react'
import {Link} from 'react-router'
import FormWrapper from './FormWrapper'

function RegistrationForm ({error,handleInputChange,handleSubmit}){
  return (
    <form onSubmit={handleSubmit} className="form">
      <h4 className="text-error">{error}</h4>

      <div className="form-field">
        <h6 className="form-field-title">First Name</h6>
        <input required name="first" onChange={handleInputChange} placeholder="Homer" className="form-field-input"/>
      </div>

      <div className="form-field">
        <h6 className="form-field-title">Last Name</h6>
        <input required name="last" onChange={handleInputChange} placeholder="Simpson" className="form-field-input"/>
      </div>

      <div className="form-field">
        <h6 className="form-field-title">Email</h6>
        <input required type="email" name="email" onChange={handleInputChange} placeholder="homer@springfield.com" className="form-field-input"/>
      </div>

      <div className="form-field">
        <h6 className="form-field-title">Password</h6>
        <input required type="password" name="password" onChange={handleInputChange} placeholder="D'oh!" className="form-field-input"/>
      </div>

      <button type="submit" className="form-submit_btn"><img src="/images/homer-icon.png"/> Submit</button>

      <div className="welcome-link"><Link to='/login' className="text-link">Already a member?</Link></div>
    </form>
  )
}

export default FormWrapper(RegistrationForm,'/api/register')
