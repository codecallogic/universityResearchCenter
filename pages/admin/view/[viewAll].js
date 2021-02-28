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
  const [asc, setAsc] = useState(-1)
  const [desc, setDesc] = useState(1)

  const handleFilter = (header, key) => {
    // GET SVG XLINK:HREF ATTRITUTE BY ELEMENT BY ID 
    let elGetAttribute = document.getElementById(`${header}${key}`).getAttribute('xlink:href')

    // GET SVG BY ELEMENT ID
    let elGetElement = document.getElementById(`${header}${key}`)

    

    let newArray = []
    
    switch (header) {
      case 'title':
        // SORT ANNOUNCEMENTS IN ASCENDING ORDER OR DESCENDING
        // STATE ASC AND DESC VALUES ARE CHANGED SETSTATE BELOW
        let filterTitles = allAnnouncements.sort( (a, b) => {
          let textA = a.title.toLowerCase();
          let textB = b.title.toLowerCase();
          return textA > textB ? asc : desc
        })

        // CHECK IF LIST IS CURENTLY IN DESCENDING OR ASCENDING AND MAKE CHANGES RESPECTIVELY
        elGetAttribute.indexOf('desc') > -1 
        ? 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-asc'),
        newArray = [...filterTitles],
        setAnnouncements(newArray),
        setAsc(1),
        setDesc(-1)
        )
        : 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-desc'),
        newArray = [...filterTitles],
        setAnnouncements(newArray),
        setAsc(-1),
        setDesc(1)
        )
        
        break;

      case 'subtitle':
        let filterSubTitles = allAnnouncements.sort( (a, b) => {
          let textA = a.subtitle.toLowerCase();
          let textB = b.subtitle.toLowerCase();
          return textA > textB ? asc : desc
        })

        elGetAttribute.indexOf('desc') > -1 
        ? 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-asc'),
        newArray = [...filterSubTitles],
        setAnnouncements(newArray),
        setAsc(1),
        setDesc(-1)
        )
        : 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-desc'),
        newArray = [...filterSubTitles],
        setAnnouncements(newArray),
        setAsc(-1),
        setDesc(1)
        )
          
        break;

      case 'createdAt':
        let filterDates = allAnnouncements.sort( (a, b) => {
          return (new Date(b.createdAt) - new Date(a.createdAt)) > -1 ? asc : desc;
        })

        elGetAttribute.indexOf('desc') > -1 
        ? 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-asc'),
        newArray = [...filterDates],
        setAnnouncements(newArray),
        setAsc(1),
        setDesc(-1)
        )
        : 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-desc'),
        newArray = [...filterDates],
        setAnnouncements(newArray),
        setAsc(-1),
        setDesc(1)
        )
          
        break;
    
      default:
        break;
    }
  }
  
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
          {headers !== null && headers.map( (header, i) => (
          <div key={i} className="announcements-table-headers-heading">
            {header !== '__v' ? header : null}
            {/* 
            TODO: Add filtering if client needs its 
            FIXME: Change which column can be filtered in ternary operator
            */}
            {header == 'title' || header == 'subtitle' || header == 'createdAt'?
            <svg onClick={ () => handleFilter(header, i)}>
              <use id={header + i} xlinkHref={`/sprite.svg#icon-chevron-thin-desc`}></use>
            </svg>
            : null
            }
          </div>
          ))
          }
        </div>
        {announcements !== null && announcements.map( (announcement, i) => (
        <div key={i} className="announcements-table-rows">
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
          <div key={keyIndex} className="announcements-table-rows-content">
            <span>{keyName !== '__v' ? 
            announcement[keyName].toString().length > 50 ?  
            announcement[keyName].toString().substring(0, 50): 
            announcement[keyName].toString() 
            : null}
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


  // CHANGE CREATEDAT DATE FORMAT TO YYYY-MM-DD
  let newResults = response.data.map( date => {
    let now = new Date(date.createdAt)
    date.createdAt = now.toISOString().slice(0,10)
    return date
  })

  return {
    allAnnouncements: response.data
  }
}

export default withAdmin(ViewAll)
