import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {API} from '../../../config'
import withAdmin from '../../withAdmin'
import {useRouter} from 'next/router'
import AdminNav from '../../../components/admin/adminNav'
import {getToken} from '../../../helpers/auth'
axios.defaults.withCredentials = true

const ViewAll = ({loggedIn, account, allAnnouncements}) => {

  const router = useRouter()

  const [user, setUser] = useState(JSON.parse(decodeURIComponent(account)))
  const [announcements, setAnnouncements] = useState(allAnnouncements)

  useEffect( () => {
    console.log(announcements)
  }, [])
  
  return (
    <>
    <AdminNav data={user}></AdminNav>
    <div className="announcements">
      <h1 className="announcements-header">All Announcements</h1>
    </div>
    </>
  )
}

ViewAll.getInitialProps = async ({query, req}) => {
  const token = getToken('accessToken', req)
  let accessToken = null
  if(token){
    accessToken = token.split('=')[1]
  }

  const response = await axios.get(`${API}/announcement/list`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      contentType: `application/json`
    }
  })

  return {
    allAnnouncements: response.data
  }
}

export default withAdmin(ViewAll)
