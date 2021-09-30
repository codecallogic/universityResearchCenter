import Nav from '../../components/admin/adminNav'
import withAdmin from '../withAdmin'
import {useState, useEffect} from 'react'
import SVG from '../../files/svg'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'

const Account = ({account, administrator, createAdministrator, userInfo}) => {
  const [user, setUser] = useState(userInfo)
  const [modal, setModal] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(userInfo){
      for(let key in userInfo){
        createAdministrator(key, userInfo[key])
      }
    }
  }, [])

  const updateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseProfile = await axios.post(`${API}/update-user-info`, {user: administrator, account: JSON.parse(decodeURIComponent(account))})
      setLoading(false)
      setError('')
      setModal('')
      for(let key in responseProfile.data){
        createAdministrator(key, responseProfile.data[key])
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error updating profile')
    }
  }

  const sendResetPasswordLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseReset = await axios.post(`${API}/user-reset-password-email`, {email: administrator.email, user: JSON.parse(decodeURIComponent(account))})
      setLoading(false)
      setError('')
      setMessage(responseReset.data)
    } catch (error) {
      setLoading(false)
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error sending reset password email')
    }
  }
  
  return (
    <>
    <Nav data={administrator}></Nav>
    <div className="account">
      <div className="account-breadcrumbs">
        <div className="account-breadcrumbs-item"><span onClick={() => window.location.href = '/admin'}>Home</span><SVG svg={'keyboard-right'}></SVG> <div>Account</div></div>
      </div>
      <div className="account-dashboard">
        <div className="account-dashboard-item" onClick={() => setModal('profile')}>
          <SVG svg={'user'}></SVG>
          <span>Profile</span>
        </div>
        <div className="account-dashboard-item" onClick={() => setModal('change_password')}>
          <SVG svg={'password'}></SVG>
          <span>Change Password</span>
        </div>
        <div className="account-dashboard-item">
          <SVG svg={'email'}></SVG>
          <span>Change Email</span>
        </div>
      </div>
      {modal == 'profile' &&
        <div className="accountUpdateProfile-modal">
          <div className="accountUpdateProfile-modal-box">
            <div className="accountUpdateProfile-modal-box-header">
              <div className="accountUpdateProfile-modal-form-title">Update Profile</div>
              <div onClick={() => (setModal(''), setError(''))}><SVG svg={'close'}></SVG></div>
            </div>
            <form action="" className="accountUpdateProfile-modal-box-form" onSubmit={(e) => updateProfile(e)}>
              <div className="form-group-single">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={administrator.username} onChange={(e) => createAdministrator('username', e.target.value)} required/>
              </div>
              <div className="form-group-single">
                <label htmlFor="first_name">First Name</label>
                <input type="text" name="first_name" value={administrator.firstName} onChange={(e) => createAdministrator('firstName', e.target.value)} required/>
              </div>
              <div className="form-group-single">
                <label htmlFor="last_name">Last Name</label>
                <input type="text" name="last_name" value={administrator.lastName} onChange={(e) => createAdministrator('lastName', e.target.value)} required/>
              </div>
              <button type="submit" className="submit-item">{!loading && <span>Update Profile</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
              {error && <span className="form-errorMessage">{error}</span>}
            </form>
          </div>
        </div>
      }
      {modal == 'change_password' &&
        <div className="accountUpdateProfile-modal">
          <div className="accountUpdateProfile-modal-box">
            <div className="accountUpdateProfile-modal-box-header">
              <div className="accountUpdateProfile-modal-form-title">Change Password</div>
              <div onClick={() => (setModal(''), setError(''))}><SVG svg={'close'}></SVG></div>
            </div>
            <form action="" className="accountUpdateProfile-modal-box-form" onSubmit={(e) => sendResetPasswordLink(e)}>
              <div className="form-group-single">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" value={administrator.email} onChange={(e) => createAdministrator('email', e.target.value)} required/>
              </div>
              <button type="submit" className="submit-item">{!loading && <span>Send Reset Password Link</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
              {error && <span className="form-errorMessage">{error}</span>}
              {message && <span className="form-successMessage">{message}</span>}
            </form>
          </div>
        </div>
      }
    </div>
    </>
  )
}

const mapStateToProps = state => {
  return {
    administrator: state.administrator
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createAdministrator: (name, value) => dispatch({type: 'CREATE_ADMIN', name: name, value: value}),
    resetAdministrator: () => dispatch({type: 'RESET_STATE'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAdmin(Account))
