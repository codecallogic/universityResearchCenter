import axios from 'axios'
import {API} from '../config'
import {getStudentToken, getStudentUser} from '../helpers/auth'
axios.defaults.withCredentials = true

const withAdmin = Page => {
  const WithAdminUser = props => <Page {...props} />
  
  WithAdminUser.getInitialProps = async context => {
    
    const token = getStudentToken('studentAccessToken', context.req)
    const user = getStudentUser('student', context.req)
    console.log(user)
    console.log(token)
    let accessToken = null
    let account = null
    let loggedIn = false
    let authorization = null
    let message = null
    
    if(token){
      accessToken = token.split('=')[1]
    }
    
    try {
      const response = await axios.get(`${API}/student`, {
          headers: {
              Authorization: `Bearer ${accessToken}`,
              contentType: `application/json`
          }
      })
      
      message = response.data
      account = user.split('=')[1]
      loggedIn = true
      authorization = accessToken

    } catch(err){
      console.log(err)
      if(err){
        message = err.response ? err.response.data : err
        account = null
        loggedIn = false
        authorization = null
      }
    }

    let userInfo = null

    if(account){
      try {
        const response = await axios.post(`${API}/student-user-info`, {user: JSON.parse(decodeURIComponent(account))})
        userInfo = response.data
      } catch (err) {
        console.log(err.response)
      }
    }

    let navMenuResponse = await axios.get(`${API}/menu/get-nav-menus`)

    let navMenu = navMenuResponse.data
  
    if(account === null){
      context.res.writeHead(302, {
        Location: '/student/login'
      });
      context.res.end();
    }else{
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        authorization,
        account,
        loggedIn,
        message,
        userInfo,
        navMenu
      }
    }
  }

  return WithAdminUser
}

export default withAdmin
