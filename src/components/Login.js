import React from 'react'
import {Link} from 'react-router'
import FormWrapper from './FormWrapper'

function LoginForm ({error,handleInputChange,handleSubmit}){
  return (
    <form onSubmit={handleSubmit} className="form">
      <h4 className="text-error">{error}</h4>

      <div className="form-field">
        <h6 className="form-field-title">Email</h6>
        <input required type="email" name="email" onChange={handleInputChange} placeholder="Email" className="form-field-input"/>
      </div>

      <div className="form-field">
        <h6 className="form-field-title">Password</h6>
        <input required type="password" name="password" onChange={handleInputChange} placeholder="Password" className="form-field-input"/>
      </div>

      <button type="submit" className="form-submit_btn"><img src="/images/homer-icon.png"/> Submit</button>

      <h4 className="welcome-link"><Link to='/' className="text-link">Not a member?</Link></h4>
    </form>
  )
}

export default FormWrapper(LoginForm,'/api/login')
