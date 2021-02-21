import axios from 'axios'
import {API} from '../config'
import {getToken, getUser} from '../helpers/auth'
axios.defaults.withCredentials = true

const withAdmin = Page => {
  const WithAdminUser = props => <Page {...props} />
  
  WithAdminUser.getInitialProps = async context => {
    
    const token = getToken('accessToken', context.req)
    const user = getUser('user', context.req)
    let accessToken = null
    let account = null
    let loggedIn = false
    let authorization = null
    let message = null
    
    if(token){
      accessToken = token.split('=')[1]
    }

    // if(accessToken){
    //     try {
    //       const response = await axios.get(`${API}/admin`, {
    //           headers: {
    //               Authorization: `Bearer ${accessToken}`,
    //               contentType: `application/json`
    //           }
    //       })
          
    //       account = user.split('=')[1]
    //       loggedIn = true
    //       authorization = accessToken

    //     } catch(err){
    //       console.log(err)
    //       if(err.response.status == 401){
    //         account = null
    //         loggedIn = false
    //         authorization = null
    //       }

    //     }
    // }
    
    // return {
    //   ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
    //   authorization,
    //   account,
    //   loggedIn
    // }

    try {
      const response = await axios.get(`${API}/admin`, {
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
      
      if(err){
        message = err.response.data
        account = null
        loggedIn = false
        authorization = null
      }
    }

    console.log(message)

    return {
      ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
      authorization,
      account,
      loggedIn,
      message
    }
  }

  return WithAdminUser
}

export default withAdmin
