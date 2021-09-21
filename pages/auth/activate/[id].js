import React, {useState, useEffect} from 'react'
import {withRouter} from 'next/router'
import {API} from '../../../config'
import jwt from 'jsonwebtoken'
import axios from 'axios'

const Activate = ({router}) => {

  const [activate, setActivate] = useState({
    token: null,
    username: null,
    activating: false
  })
  const [error, setError] = useState('')

  useEffect( () => {
    let token = router.query.id
    if(token){
      let {username} = jwt.decode(token)
      setActivate({...activate, token, username})
    }
    
  }, [router])
  
  const {token, username, activating} = activate

  const activateAccount = async () => {
    setActivate({...activate, activating: true})
    try {
      const response = await axios.post(`${API}/register/activate`, {token}, {withCredentials: true})
      console.log(response)
      setActivate({...activate, activating: false})
      window.location.href = '/admin'
    } catch (error) {
      setActivate({...activate, activating: false})
      console.log(error.response.data)
      if(error) return error.response ? setError(error.response.data) : setError('This url has expired, please submit another invite request.')
    }
  }
  
  return (
    <div className="activate-container">
      <div className="activate">
        <div className="activate-title">Hello, <span>{username}</span></div>
        <span>Click on the button below to activate your account.</span>
        {/* <button className="activate-button" onClick={activateAccount}>
          {activating ? <span>Activate</span> : <div className="loading"><span></span><span></span><span></span></div>}
        </button> */}
        <button type="submit" className="activate-button" onClick={activateAccount}>{!activating && <span>Activate Account</span>}{activating && <div className="loading"><span></span><span></span><span></span></div>}</button>
        {error ? <div className="form-errorMessage">{error} <a href="/">Visit Homepage</a></div> : null}
      </div>
    </div>
  )
}

export default withRouter(Activate)
