import Nav from '../../components/nav'
import {API} from '../../config'
import axios from 'axios'
import {useState, useEffect} from 'react'

const Login = ({navMenu}) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [toggle, setToggle] = useState({showToggle: false})
  const {showToggle} = toggle

  const showPassword = (e) => {
    const element = document.getElementById('password')
    showToggle === false ? setToggle({...toggle, showToggle: true}) : setToggle({...toggle, showToggle: false})
    element.type === 'password' ? element.type = 'text' : element.type = 'password'
  }

  const loginAdmin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${API}/student/login`, {username, password})
      setLoading(false)
      window.location.href = '/student'
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setMessage(error.response.data) : setMessage('Error login you in, please try again later')
    }
  }
  
  return (
    <>
    <Nav navMenu={navMenu}></Nav>
    <div className="student-login">
    <div className="admin">
      <div className="admin-side">
        <div className="admin-side-background" style={{backgroundImage: "url(" + `https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80` + ")"}}></div>
        </div>
        <div className="admin-form">
          <div className="admin-form-heading">Welcome Back</div>
          <div className="admin-form-subheading">Student Login</div>
          <form method="POST" onSubmit={loginAdmin}>
            <div className="admin-form-container">
              <div className="admin-form-group">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} value={username} required/>
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
                  <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} required/>
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
                <button type="submit" className="admin-form-button">{!loading && <span>Login</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
            </div>
          </form>
          {message && <div className="form-errorMessage">{message}</div>}
        </div>
      </div>
    </div>
    </>
  )
}

Login.getInitialProps = async () => {

  let navMenusResponse = await axios.get(`${API}/menu/get-nav-menus`)

  return {
    navMenu: navMenusResponse.data
  }
}

export default Login
