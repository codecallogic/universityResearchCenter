import {API} from '../../../config'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import Nav from '../../../components/nav'

const ChangeEmail = ({error}) => {
  return (
    <>
    <Nav></Nav>
    <div className="changeEmail">
      {error && <div className="changeEmail-message">{error}</div>}
    </div>
    </>
  )
}

ChangeEmail.getInitialProps = async ({query, res}) => {
  let token = jwt.decode(query.id)
  let error = null

  if(query.id !== 'sprite.svg' && token !== null){
    try {
      const responseEmail = await axios.post(`${API}/user-update-email`, 
      {token: query.id, user: token})
      res.writeHead(307, { Location: '/admin/account' })
      res.end()
    } catch (err) {
      if(err) error = err.response.data
    }
  }

  return {
    error: error
  }
}

export default ChangeEmail
