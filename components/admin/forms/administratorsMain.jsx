
import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {API} from '../../../config'
import axios from 'axios'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'

const Administrators = ({viewAll, authorization, errorMessage, successMessage, administrator, createAdministrator, resetAdministrator}) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
   createAdministrator('role', 'admin')
  }, [])

  // BROWSER CHARACTER SET https://net-comber.com/charset.html
  const getRandomLower = () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
  }
   
  const getRandomUpper = () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
  }

  const getRandomNumber = () => {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48)
  }

  const getRandomSymbol = () => {
    const symbols = '!@#$%^&*(){}[]=<>/,.'
    return symbols[Math.floor(Math.random() * symbols.length)]
  }

  const randomFunc = () => {
    let numbersAvailable = [1, 2, 3, 4];
    let randomSort = []
    let res = numbersAvailable.sort( () => {
      return .5 - Math.random()
    })
    
    return res
  }

  const generatePassword = () => {
    let password = ''
    for(let i = 0; i <= 3; i += 1){
      password
      let allFunc = [
        {lower: getRandomLower()},
        {upper: getRandomUpper()},
        {number: getRandomNumber()},
        {symbol: getRandomSymbol()}
      ]
      let funcSort = randomFunc()
      funcSort.forEach((item) => {
        password += Object.values(allFunc[item - 1])[0]
      })
    }
    createAdministrator('tempPassword', password)
    createAdministrator('password', password)
    return password
  }

  const submitAdministrator = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    let password = generatePassword()
    administrator.tempPassword = password
    administrator.password = password
    if(!administrator.firstName) return setError('First name field cannot be empty')
    if(!administrator.lastName) return setError('Last name field cannot be empty')
  
    try {
      const responseRegister = await axios.post(`${API}/register`, administrator, {
        headers: {
            Authorization: `Bearer ${authorization}`,
            contentType: `application/json`
        }
      })
      console.log(responseRegister)
      setLoading(false)
      resetAdministrator()
      setSuccess(responseRegister.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error.response) console.log(error.response)
      if(error) return error.response ? setError(error.response.data) : setError('We could not send invite, please try again later')
    }
  }
  
  return (
    <div className="dashboard-right-panel">
      <div className="dashboard-right-panel-toggle" onClick={() => window.location.href = `/admin/view/administrators`}>View All Adminstrators</div>
      <form className="form" onSubmit={(e) => submitAdministrator(e)}>
        <div className="form-group-single">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" value={administrator.username} onChange={(e) => createAdministrator('username', e.target.value)} required/>
        </div>
        <div className="form-group-single">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={administrator.email} onChange={(e) => createAdministrator('email', e.target.value)} required/>
        </div>
        <div className="form-group-single">
          <label htmlFor="first_name">First Name</label>
          <input type="text" name="first_name" value={administrator.first_name} onChange={(e) => createAdministrator('firstName', e.target.value)} required/>
        </div>
        <div className="form-group-single">
          <label htmlFor="last_name">Last Name</label>
          <input type="text" name="last_name" value={administrator.last_name} onChange={(e) => createAdministrator('lastName', e.target.value)} required/>
        </div>
        {/* <div className="form-group-single">
          <label htmlFor="password">Temporary Password <span className="form-group-single-label-button" onClick={() => generatePassword()}>Generate Password</span></label>
          <input type="text" name="password" value={administrator.tempPassword} readOnly required/>
        </div> */}
        <button type="submit" className="submit-item">{!loading && <span>Create Administrator</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
      </form>
      {error && <div className="form-errorMessage">{error}</div>}
      {success && <div className="form-successMessage">{success}</div>}
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Administrators)
