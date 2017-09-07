import React from 'react'
import {Link} from 'react-router'
import FormWrapper from './FormWrapper'

function RegistrationForm ({error,handleInputChange,handleSubmit}){
  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <h4 className="form-error">{error}</h4>

        <div className="form-field">
          <h6 className="form-field-title">First Name</h6>
          <input required name="first" onChange={handleInputChange} placeholder="First Name" className="form-field-input"/>
        </div>

        <div className="form-field">
          <h6 className="form-field-title">Last Name</h6>
          <input required name="last" onChange={handleInputChange} placeholder="Last Name" className="form-field-input"/>
        </div>

        <div className="form-field">
          <h6 className="form-field-title">Email</h6>
          <input required type="email" name="email" onChange={handleInputChange} placeholder="Email" className="form-field-input"/>
        </div>

        <div className="form-field">
          <h6 className="form-field-title">Password</h6>
          <input required type="password" name="password" onChange={handleInputChange} placeholder="Password" className="form-field-input"/>
        </div>

        <button type="submit" className="form-submit">Submit</button>
      </form>

      <Link to='/login' className="link">Login</Link>
    </div>
  )
}

export default FormWrapper(RegistrationForm,'/register')
