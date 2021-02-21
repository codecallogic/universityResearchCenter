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
      router.push('/admin')
    } catch (error) {
      console.log(error.response.data)
    }
  }
  
  return (
    <div className="activate-container">
      <div className="activate">
        <div className="activate-title">Hello, <span>{username}</span></div>
        <span>Click on the button below to activate your account.</span>
        <button className="activate-button" onClick={activateAccount}>
          {activating == false && <span>Activate</span> }
          {activating && <img src="/media/loading.gif" alt="Loading" />}
        </button>
      </div>
    </div>
  )
}

export default withRouter(Activate)
