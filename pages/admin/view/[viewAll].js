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
  const [headers, setHeaders] = useState(Object.keys(allAnnouncements[0]))

  useEffect( () => {
    console.log(headers)
  }, [])
  
  return (
    <>
    <AdminNav data={user}></AdminNav>
    <div className="announcements">
      <h1 className="announcements-header">All Announcements</h1>
      <div className="announcements-table">
        <div className="announcements-table-headers">
          <div className="announcements-table-group">
            <label htmlFor="selectAll">
              <input type="checkbox" name="selectAll"/>
              <span></span>
              <div>
                <svg>
                  <use xlinkHref="/sprite.svg#icon-checkmark"></use>
                </svg>
              </div>
            </label>
          </div>
          {headers !== null && headers.map( (header) => (
          <div className="announcements-table-headers-heading">
            {header !== '__v' ? header : null}
            {/* TODO: Add filtering if client needs its */}
            {header !== '__v' ?
            <svg>
              <use xlinkHref={`/sprite.svg#icon-chevron-thin-desc`}></use>
            </svg>
            : null
            }
          </div>
          ))
          }
        </div>
        {allAnnouncements !== null && allAnnouncements.map( (announcement) => (
        <div className="announcements-table-rows">
          <div className="announcements-table-group">
            <label htmlFor="selectAll">
              <input type="checkbox" name="selectAll"/>
              <span></span>
              <div>
                <svg>
                  <use xlinkHref="/sprite.svg#icon-checkmark"></use>
                </svg>
              </div>
            </label>
          </div>
          {Object.keys(announcement).map( (keyName, keyIndex) => (
          <div className="announcements-table-rows-content">
            <span>{keyName !== '__v' ? announcement[keyName].toString().length > 50 ?  announcement[keyName].toString().substring(0, 50): announcement[keyName].toString() : null}
            </span>
            {/* <svg>
              <use xlinkHref={`/sprite.svg#icon-chevron-thin-desc`}></use>
            </svg> */}
          </div>
          ))}
        </div>
        ))}
      </div>
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
