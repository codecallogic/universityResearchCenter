import Nav from '../../components/admin/adminNav'
import withAdmin from '../withAdmin'
import {useState, useEffect} from 'react'
import SVG from '../../files/svg'

const Account = ({account}) => {

  const [user, setUser] = useState(JSON.parse(decodeURIComponent(account)))
  
  return (
    <>
    <Nav data={user}></Nav>
    <div className="account">
      <div className="account-breadcrumbs">
        <div className="account-breadcrumbs-item"><span onClick={() => window.location.href = '/admin'}>Home</span><SVG svg={'keyboard-right'}></SVG> <div>Account</div></div>
      </div>
      <div className="account-dashboard">
        <div className="account-dashboard-item">
          <SVG svg={'user'}></SVG>
          <span>Profile</span>
        </div>
        <div className="account-dashboard-item">
          <SVG svg={'password'}></SVG>
          <span>Change Password</span>
        </div>
        <div className="account-dashboard-item">
          <SVG svg={'email'}></SVG>
          <span>Change Email</span>
        </div>
      </div>
    </div>
    </>
  )
}

export default withAdmin(Account)
