import Nav from '../../../components/nav'
import {API} from '../../../config'
import {useState, useEffect} from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'

const ResetPassword = ({user, token}) => {
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [retypeNewPassword, setRetypeNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const changePassword = async (e) => {
    e.preventDefault()
    if(newPassword !== retypeNewPassword) setError('Retyped password does not match new password')
    setLoading(true)
    if(user){
      try {
        const responsePassword = await axios.post(`${API}/user-change-password`, {currentPassword: currentPassword, password: newPassword, user: user, token: token})
        setLoading(false)
        setError('')
        setMessage(responsePassword.data)
      } catch (error) {
        console.log(error)
        // console.log(error.response)
        setLoading(false)
        if(error.response.data.error) return error.response.data.error ? setError(error.response.data.error) : null
        if(error) return error.response ? setError(error.response.data) : setError('There was an error changing your password')
      }
    }
  }
  
  return (
    <>
      <Nav></Nav>
      <div className="change_password">
        <div className="change_password-title">Update Password</div>
        <form action="" className="change_password-form" onSubmit={(e) => changePassword(e)}>
          <div className="form-group-single">
            <label htmlFor="username">Current Password</label>
            <input type="password" name="username" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required/>
          </div>
          <div className="form-group-single">
            <label htmlFor="first_name">New Password</label>
            <input type="password" name="first_name" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
          </div>
          <div className="form-group-single">
            <label htmlFor="last_name">Retype New Password</label>
            <input type="password" name="last_name" value={retypeNewPassword} onChange={(e) => setRetypeNewPassword(e.target.value)} required/>
          </div>
          <button type="submit" className="submit-item">{!loading && <span>Change Password</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
        </form>
        <div className="change_password-error_handling">
          {error && <span className="form-errorMessage">{error}</span>}
          {message && <span className="form-successMessage">{message}, <a href='/admin'>Login</a></span>}
        </div>
      </div>
    </>
  )
}

ResetPassword.getInitialProps = async ({query}) => {
  let token = jwt.decode(query.id)

  return {
    user: token,
    token: query.id
  }
}

export default ResetPassword