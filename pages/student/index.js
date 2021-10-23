import withStudent from '../withStudent'
import Nav from '../../components/nav'
import Footer from '../../components/footer'
import {useState, useEffect} from 'react'
import SVG from '../../files/svg'
import {connect} from 'react-redux'
import axios from 'axios'
import {API} from '../../config'

const Dashboard = ({account, userInfo, navMenu, student, updateStudentProfile}) => {
  // console.log(JSON.parse(decodeURIComponent(account)))
  const [user, setUser] = useState(userInfo)
  const [modal, setModal] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [newEmail, setNewEmail] = useState('')

  useEffect(() => {
    for(let key in userInfo){
      updateStudentProfile(key, userInfo[key])
    }
  }, [])

  const sendResetPasswordLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseReset = await axios.post(`${API}/student-change-password-email`, {email: student.email, user: userInfo})
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
      <Nav navMenu={navMenu} account={account}></Nav>
      <div className="account-student">
        <div className="account-student-breadcrumbs">
          <div className="account-student-breadcrumbs-item"><span onClick={() => window.location.href = '/'}>Home</span><SVG svg={'keyboard-right'}></SVG> <div>Account</div></div>
        </div>
        <div className="account-student-dashboard">
          <div className="account-student-dashboard-item" onClick={() => setModal('profile')}>
            <SVG svg={'user'}></SVG>
            <span>Profile</span>
          </div>
          <div className="account-student-dashboard-item" onClick={() => setModal('change_password')}>
            <SVG svg={'password'}></SVG>
            <span>Change Password</span>
          </div>
          {/* <div className="account-student-dashboard-item" onClick={() => setModal('change_email')}>
            <SVG svg={'email'}></SVG>
            <span>Change Email</span>
          </div> */}
        </div>
      </div>
      {modal == 'change_password' &&
        <div className="accountUpdateProfile-modal">
          <div className="accountUpdateProfile-modal-box">
            <div className="accountUpdateProfile-modal-box-header">
              <div className="accountUpdateProfile-modal-form-title">Change Password</div>
              <div onClick={() => (setModal(''), setError(''), setMessage(''))}><SVG svg={'close'}></SVG></div>
            </div>
            <form action="" className="accountUpdateProfile-modal-box-form" onSubmit={(e) => sendResetPasswordLink(e)}>
              <div className="form-group-single">
                <label htmlFor="email">Email Linked to Account</label>
                <input type="text" name="email" value={student.email} onChange={(e) => updateStudentProfile('email', e.target.value)} readOnly required/>
              </div>
              <button type="submit" className="submit-item">{!loading && <span>Change Password</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
              {error && <span className="form-errorMessage">{error}</span>}
              {message && <span className="form-successMessage">{message}</span>}
            </form>
          </div>
        </div>
      }
      <Footer navMenu={navMenu}></Footer>
    </>
  )
}

const mapStateToProps = state => {
  return {
    student: state.studentProfile
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateStudentProfile: (name, value) => dispatch({type: 'UPDATE_STATE_STUDENT', payload: {name: name, value: value}}),
    resetState: () => dispatch({type: 'RESET_STATE'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStudent(Dashboard))
