import {useState, useEffect} from 'react'
import withAdmin from '../withAdmin'
import axios from 'axios'
import {API} from '../../config'
import {useRouter} from 'next/router'

const adminLogin = ({loggedIn}) => {

  const router = useRouter();

  const [user, setLogin] = useState({
    loginCred: '',
    password: '',
    code: '',
  })

  const [messages, setMessage] = useState({
    error: null,
    success: null
  })

  useEffect( () => {
    if(loggedIn) router.push('/')
  }, [loggedIn])

  const {loginCred, password, code} = user
  const [toggle, setToggle] = useState({showToggle: false})
  const {showToggle} = toggle
  const {error} = messages

  const handleChange = (e) => {
    setLogin({...user, [e.target.name]: e.target.value})
    setMessage({...messages, error: null})
  }

  const showPassword = (e) => {
    const element = document.getElementById('password')
    showToggle === false ? setToggle({...toggle, showToggle: true}) : setToggle({...toggle, showToggle: false})
    element.type === 'password' ? element.type = 'text' : element.type = 'password'
  }

  const loginAdmin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/admin/login`, {loginCred, password, code})
      window.location.href = '/admin'
    } catch (error) {
      if(error.response.data) setMessage({...messages, error: error.response.data})
    }
  }
  
  return (
    <div>
    {!loggedIn && <div className="admin">
      <div className="admin-side">
        <div className="admin-side-background" style={{backgroundImage: "url(" + `https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80` + ")"}}></div>
      </div>
      <div className="admin-form">
        <div className="admin-form-heading">Welcome Back</div>
        <div className="admin-form-subheading">Admin Login</div>
        <form method="POST" onSubmit={loginAdmin}>
          <div className="admin-form-container">
            <div className="admin-form-group">
              <label htmlFor="loginCred">Username</label>
              <input type="text" name="loginCred" onChange={handleChange} value={loginCred} required/>
            </div>
            <div className="admin-form-group">
                <div className="admin-form-group-password">
                  <label htmlFor="password">Password</label>
                    {showToggle === false &&
                      <span onClick={showPassword}>
                      <svg>
                        <use xlinkHref="/sprite.svg#icon-eye"></use>
                      </svg>
                      Show
                    </span>
                    }
                    {showToggle === true &&
                      <span onClick={showPassword} id="hide">
                        <svg>
                          <use xlinkHref="/sprite.svg#icon-eye-blocked"></use>
                        </svg>
                        Hide
                      </span>
                    }          
                </div>
                <input type="password" name="password" id="password" onChange={handleChange} value={password} required/>
                <div className="admin-form-group-validation-password">
                    <ul>
                      <li>One lowercase letter</li>
                      <li>One uppercase letter</li>
                      <li>One number</li>
                      <li>One special character</li>
                      <li>8 characters minimum</li>
                    </ul>
                </div>
              </div>
              <div className="admin-form-group">
                <label htmlFor="code">Admin Code</label>
                <input type="text" name="code" onChange={handleChange} value={code} required/>
              </div>
              <button type="submit" className="admin-form-button">Login</button>
          </div>
        </form>
        {error !== null && <div className="form-errorhandling">{error}</div>}
      </div>
    </div>
    }
    </div>
  )
}

export default withAdmin(adminLogin)
