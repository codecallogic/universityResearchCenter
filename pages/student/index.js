import withStudent from '../withStudent'
import Nav from '../../components/nav'
import Footer from '../../components/footer'
import {useState, useEffect} from 'react'
import SVG from '../../files/svg'

const Dashboard = ({account, userInfo, navMenu}) => {

  const [user, setUser] = useState(userInfo)
  const [modal, setModal] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  
  return (
    <>
      <Nav navMenu={navMenu}></Nav>
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
          <div className="account-student-dashboard-item" onClick={() => setModal('change_email')}>
            <SVG svg={'email'}></SVG>
            <span>Change Email</span>
          </div>
        </div>
      </div>
      <Footer navMenu={navMenu}></Footer>
    </>
  )
}

export default withStudent(Dashboard)
