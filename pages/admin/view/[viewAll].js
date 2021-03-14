import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {API} from '../../../config'
import withAdmin from '../../withAdmin'
import {useRouter} from 'next/router'
import AdminNav from '../../../components/admin/adminNav'
import {getToken} from '../../../helpers/auth'
import {parseCreatedAtDates, parseExpirationDates} from '../../../helpers/sort'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'
axios.defaults.withCredentials = true

const ViewAll = ({account, allContent, authorization, current}) => {

  const router = useRouter()

  const [user, setUser] = useState(JSON.parse(decodeURIComponent(account)))
  const [content, setContent] = useState(allContent)
  const [headers, setHeaders] = useState(allContent.length > 0 ? Object.keys(allContent[0]) : null)
  const [selected, setSelected] = useState([])
  const [asc, setAsc] = useState(-1)
  const [desc, setDesc] = useState(1)
  const [editRowForm, setEditRowForm] = useState(false)
  const [updatedRow, setUpdatedRow] = useState({
    id: '',
    title: '',
    subtitle: '',
    imageURL: '',
    imageDescr: '',
    source: '',
    expiration: '',
    primary: false,
    enabled: true,
    message: ''
  })
  const [messages, setMessage] = useState({
    error: null,
    success: null
  })

  const {error, success} = messages
  const {title, subtitle, imageURL, imageDescr, source, expiration, primary, enabled, message} = updatedRow

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
        let filterTitles = content.sort( (a, b) => {
          let textA = a.title.toLowerCase();
          let textB = b.title.toLowerCase();
          return textA < textB ? asc : desc
        })

        // CHECK IF LIST IS CURENTLY IN DESCENDING OR ASCENDING AND MAKE CHANGES RESPECTIVELY
        elGetAttribute.indexOf('desc') > -1 
        ? 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-asc'),
        newArray = [...filterTitles],
        setContent(newArray),
        setAsc(1),
        setDesc(-1)
        )
        : 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-desc'),
        newArray = [...filterTitles],
        setContent(newArray),
        setAsc(-1),
        setDesc(1)
        )
        
        break;

      case 'subtitle':
        let filterSubTitles = content.sort( (a, b) => {
          let textA = a.subtitle.toLowerCase();
          let textB = b.subtitle.toLowerCase();
          return textA < textB ? asc : desc
        })

        elGetAttribute.indexOf('desc') > -1 
        ? 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-asc'),
        newArray = [...filterSubTitles],
        setContent(newArray),
        setAsc(1),
        setDesc(-1)
        )
        : 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-desc'),
        newArray = [...filterSubTitles],
        setContent(newArray),
        setAsc(-1),
        setDesc(1)
        )
          
        break;

      case 'createdAt':
        let filterDates = content.sort( (a, b) => {
          return (new Date(b.createdAt) - new Date(a.createdAt)) > -1 ? asc : desc;
        })

        elGetAttribute.indexOf('desc') > -1 
        ? 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-asc'),
        newArray = [...filterDates],
        setContent(newArray),
        setAsc(1),
        setDesc(-1)
        )
        : 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-desc'),
        newArray = [...filterDates],
        setContent(newArray),
        setAsc(-1),
        setDesc(1)
        )
          
        break;

      case 'expiration':
        let filterExpirationDates = content.sort( (a, b) => {
          return (new Date(b.expiration) - new Date(a.expiration)) > -1 ? asc : desc;
        })

        elGetAttribute.indexOf('desc') > -1 
        ? 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-asc'),
        newArray = [...filterExpirationDates],
        setContent(newArray),
        setAsc(1),
        setDesc(-1)
        )
        : 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-desc'),
        newArray = [...filterExpirationDates],
        setContent(newArray),
        setAsc(-1),
        setDesc(1)
        )
          
        break;
    
      default:
        break;
    }
  }

  // IF TOP ROW IS CLICKED UPDATE STATE WITH ALL ITEMS
  const selectAll = () => {
    const selectAll = document.querySelectorAll('input[name="selectAll"]')
    const allCheckBoxes = document.querySelectorAll('input[type="checkbox"]')
    if(selectAll[0].checked == true){
      let allSelected = []

      for(let i = 0; i < allCheckBoxes.length; i++){
        if(allCheckBoxes[i].type == 'checkbox'){
          allCheckBoxes[i].value !== 'on' ? allSelected.push(allCheckBoxes[i].value) : null
          allCheckBoxes[i].checked = true
        }
      }

      setSelected(allSelected)

    }else{

      if(selectAll[0].checked == false){
        let allSelected = []
        for(let i = 0; i < allCheckBoxes.length; i++){
          if(allCheckBoxes[i].type == 'checkbox'){
            allCheckBoxes[i].checked = false
          }
        }

        setSelected(allSelected)

      }
    }
  }

  // IF ONE ROW IS CLICKED ADD TO ARRAY OF SELECTED ROWS
  const rowClicked = (e) => {
    const getRow = document.getElementById(e.target.value)
    const allCheckBoxes = document.querySelectorAll('input[type="checkbox"]')
    let allSelected = []

    if(getRow.checked == true){

      for(let i = 0; i < allCheckBoxes.length; i++){
        if(allCheckBoxes[i].checked == true){
          allSelected.push(allCheckBoxes[i].value)
        }
      }

      setSelected(allSelected)

    }

    if(getRow.checked == false){
      const array = [...selected]
      let index = array.indexOf(e.target.value)

      if(index !== -1){

        array.splice(index, 1)
        setSelected(array)

      }
    }
    
  }

  // SET UP VIEW FOR EDITING AND UPDATING ROW DATA
  const editRow = () => {
    setMessage({...messages, error: '', success: ''})
    for(let i = 0; i < content.length; i++){
      if(content[i]._id == selected[0]){
        setEditRowForm(true)
        setUpdatedRow({...updatedRow, id: content[i]._id, title: content[i].title,  subtitle: content[i].subtitle, imageURL: content[i].imageURL, imageDescr: content[i].imageDescr, source: content[i].source, expiration: content[i].expiration, primary: content[i].primary, enabled: content[i].enabled, message: content[i].message})
      }
    }
  }

  // UPDATE STATE OF CURRENT ROW BEING EDITING
  const handleChange = (e) => {
    e.target.name == 'primary' ? setUpdatedRow({...updatedRow, [e.target.name]: e.target.checked}) : null
    e.target.name == 'enabled' ? setUpdatedRow({...updatedRow, [e.target.name]: !e.target.checked}) : null
    e.target.name !== 'primary' && e.target.name !== 'enabled' ? setUpdatedRow({...updatedRow, [e.target.name]: e.target.value}) : null
    setMessage({...messages, success: null, error: null})
  }

  // HANDLE REACT QUILL CONTENT CHANGE
  const handleQuill = (e) => {
    setUpdatedRow({...updatedRow, message: e})
    setMessage({...messages, success: null, error: null})
  }

  // SUBMIT UPDATED FOR ANNOUNCEMENT ROW CONTENT
  const submitUpdateAnnouncement = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/announcement/update`, updatedRow, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setContent(response.data)
      setMessage({...messages, success: 'Update was made successfully'})
    } catch (error) {
      setMessage({...messages, error: error.response.data})
    }
  }

  // SUBMIT UPDATED FOR MEETING ROW CONTENT
  const submitUpdateMeeting = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/meeting/update`, updatedRow, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setMessage({...messages, success: 'Update was made successfully'})
      setContent(response.data)
    } catch (error) {
      console.log(error.response)
      setMessage({...messages, error: error.response})
    }
  }

  // SUBMIT UPDATE FOR FACULTY OPPORTUNITY
  const submitUpdateFacultyOpportunity = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/opportunity-faculty/update`, updatedRow, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setMessage({...messages, success: 'Update was made successfully'})
      setContent(response.data)
    } catch (error) {
      console.log(error.response)
      setMessage({...messages, error: error.response})
    }
  }

  // SUBMIT UPDATE FOR STUDENT OPPORTUNITY
  const submitUpdateStudentOpportunity = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/opportunity-students/update`, updatedRow, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setMessage({...messages, success: 'Update was made successfully'})
      setContent(response.data)
    } catch (error) {
      console.log(error.response)
      setMessage({...messages, error: error.response})
    }
  }

  const deleteRow = async (e) => {
    e.preventDefault()
    try {
      switch (current) {
        case 'announcements':
          const responseAnnouncements = await axios.post(`${API}/announcement/delete`, selected, {
            headers: {
              Authorization: `Bearer ${authorization}`,
              contentType: `application/json`
            }
          })
          setContent(responseAnnouncements.data)
          break;
        
        case 'meetings and activities':
          const responseMeetings = await axios.post(`${API}/meeting/delete`, selected, {
            headers: {
              Authorization: `Bearer ${authorization}`,
              contentType: `application/json`
            }
          })
          parseExpirationDates(responseMeetings.data)
          parseCreatedAtDates(responseMeetings.data)
          setContent(responseMeetings.data)
          break;
        
      case 'opportunities for faculty':
        const responseFacultyOpportunities = await axios.post(`${API}/opportunity-faculty/delete`, selected, {
          headers: {
            Authorization: `Bearer ${authorization}`,
            contentType: `application/json`
          }
        })
        parseExpirationDates(responseFacultyOpportunities.data)
        parseCreatedAtDates(responseFacultyOpportunities.data)
        setContent(responseFacultyOpportunities.data)
        break;

      case 'opportunities for students':
        const responseStudentOpportunities = await axios.post(`${API}/opportunity-students/delete`, selected, {
          headers: {
            Authorization: `Bearer ${authorization}`,
            contentType: `application/json`
          }
        })
        parseExpirationDates(responseStudentOpportunities.data)
        parseCreatedAtDates(responseStudentOpportunities.data)
        setContent(responseStudentOpportunities.data)
        break;
      
        default:
          break;
      }
      
      setSelected([])
      const allCheckBoxes = document.querySelectorAll('input[type="checkbox"]')
      for(let i = 0; i < allCheckBoxes.length; i++){
        if(allCheckBoxes[i].checked == true){
          for(let i = 0; i < allCheckBoxes.length; i++){
              allCheckBoxes[i].checked = false
          }
        }
      }
      setMessage({...messages, success: 'Announcement was deleted successfully'})
    } catch (error) {
      setMessage({...messages, error: error.response.error})
    }
  }
  
  const viewAllButton = (e) => {
    e.preventDefault()
    setSelected([])

    // FORMAT ISO DATE FORMAT TO YYYY/MM/DD FOR CREATEAT OBJECT PROPERTY
    parseCreatedAtDates(content)

    // IF NOT ANNOUNCEMENTS DATA LIST FORMAT ISO DATE FORMAT TO YYYY/MM/DD FOR EXPIRATION OBJECT PROPERTY
    current !== 'announcements' ? parseExpirationDates(content) : null

    // DON'T SHOW UPDATE ROW FORM
    setEditRowForm(false)
  }
  
  return (
    <>
    <AdminNav data={user}></AdminNav>
    <div className="content">
      <h1 className="content-header">All {current}</h1>
      <div className="content-table">
        {editRowForm == false && 
          <div className="content-table-buttons">
            <button className={ selected.length >= 1 ? 'enabled ' : null} disabled={selected.length >= 1 ? false: true}onClick={deleteRow}>Delete</button>
            <button className={ selected.length == 1 ? 'enabled ' : null} disabled={selected.length == 1 ? false: true} onClick={editRow}>Edit</button>
          </div>
        }

        {editRowForm == true && 
          <div className="content-table-buttons">
            <button className="enabled" onClick={viewAllButton}>View All</button>
          </div>
        }
        
        <div className="content-table-headers">
          {editRowForm == false && 
          <div className="content-table-group">
            <label htmlFor="selectAll" onClick={selectAll}>
              <input type="checkbox" name="selectAll"/>
              <span></span>
              <div>
                <svg>
                  <use xlinkHref="/sprite.svg#icon-checkmark"></use>
                </svg>
              </div>
            </label>
          </div>
          }
          {headers !== null && editRowForm == false && headers.map( (header, i) => (
          header !== 'primary' && header !== 'enabled' && header !== '__v' ? 
            <div key={i} className="content-table-headers-heading">
              {header}
              {/* 
              TODO: Add filtering if client needs its 
              FIXME: Change which column can be filtered in ternary operator
              */}
              {header == 'title' || header == 'subtitle' || header == 'createdAt' || header == 'expiration'?
              <svg onClick={ () => handleFilter(header, i)}>
                <use id={header + i} xlinkHref={`/sprite.svg#icon-chevron-thin-desc`}></use>
              </svg>
              : null
              }
            </div>
          : null
          ))
          }
        </div>

        {content !== null && editRowForm == false && content.map( (item, i) => (
        <div key={i} className="content-table-rows">
          <div className="content-table-group">
            <label htmlFor="selectAll">
              <input type="checkbox" id={item._id} value={item._id} onClick={rowClicked}/>
              <span></span>
              <div>
                <svg>
                  <use xlinkHref="/sprite.svg#icon-checkmark"></use>
                </svg>
              </div>
            </label>
          </div>
          {Object.keys(item).map( (keyName, keyIndex) => (
          keyName !== '__v' && keyName !== 'primary' && keyName !== 'enabled'  ?  
            <div key={keyIndex} className="content-table-rows-content">
              <span>
              {item[keyName].toString().length > 50 ?  
              item[keyName].toString().substring(0, 50): 
              item[keyName].toString()
              } 
              </span>
              {/* <svg>
                <use xlinkHref={`/sprite.svg#icon-chevron-thin-desc`}></use>
              </svg> */}
            </div>
          : null
          ))}
        </div>
        ))}

        {editRowForm == true && current == 'announcements' && 
          <form className="form editing" action="POST" onSubmit={submitUpdateAnnouncement}>
            <div className="form-group-single">
              <label htmlFor="title">Title</label>
              <input type="text" name="title" value={title} required onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="subtitle">Sub-title (optional)</label>
              <input type="text" name="subtitle" value={subtitle} onChange={handleChange}/>
            </div>
            <div className="form-group-double">
              <div className="form-group-checkbox">
                <label htmlFor="primary">
                  <input type="checkbox" name="primary" checked={primary} onChange={handleChange}/>
                  <span></span>
                  <div>
                    <svg>
                      <use xlinkHref="/sprite.svg#icon-checkmark"></use>
                    </svg>
                  </div>
                </label>
                Display as Primary Announcement
              </div>
              
            </div>
            <div className="form-group-double">
              <div className="form-group-checkbox">
                  <label htmlFor="enabled">
                    <input type="checkbox" name="enabled" checked={!enabled} onChange={handleChange}/>
                    <span></span>
                    <div>
                      <svg>
                        <use xlinkHref="/sprite.svg#icon-checkmark"></use>
                      </svg>
                    </div>
                  </label>
                  Disable
              </div>
            </div>
            <div className="form-group-double">
              <label htmlFor="image">Image URL</label>
              <input type="text" name="imageURL" value={imageURL} required onChange={handleChange}/>
            </div>
            <div className="form-group-double">
              <label htmlFor="title">Image Short Description</label>
              <input type="text" name="imageDescr" value={imageDescr} required onChange={handleChange}/>
            </div>
            <div className="form-group-single">
                <label htmlFor="message">Message</label>
                <ReactQuill 
                    placeholder="Write something..."
                    className="form-group-quill"
                    theme="snow"
                    name="message"
                    value={message}
                    onChange={handleQuill}
                />
            </div>
            <button type="submit" className="submit-item">Update Anouncement</button>
          </form>
        }

        {editRowForm == true && current == 'meetings and activities' && 
          <form className="form editing" action="POST" onSubmit={submitUpdateMeeting}>
            <div className="form-group-single">
              <label htmlFor="title">Title</label>
              <input type="text" name="title" value={title} required onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="subtitle">Sub-title (optional)</label>
              <input type="text" name="subtitle" value={subtitle} onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="source">Source</label>
              <input type="text" name="source" value={source} onChange={handleChange} required/>
            </div>
            <div className="form-group-double">
              <div className="form-group-checkbox">
                  <label htmlFor="enabled">
                    <input type="checkbox" name="enabled" checked={!enabled} onChange={handleChange}/>
                    <span></span>
                    <div>
                      <svg>
                        <use xlinkHref="/sprite.svg#icon-checkmark"></use>
                      </svg>
                    </div>
                  </label>
                  Disable
              </div>
            </div>
            <div className="form-group-single">
              <label htmlFor="expiration">Expiration Date</label>
              <input type="date" name="expiration" value={expiration} placeholder="mm / dd / yyyy" onChange={handleChange} required/>
            </div>
            <div className="form-group-single">
                <label htmlFor="message">Message</label>
                <ReactQuill 
                    placeholder="Write something..."
                    className="form-group-quill"
                    theme="snow"
                    name="message"
                    value={message}
                    onChange={handleQuill}
                />
            </div>
            <button type="submit" className="submit-item">Update Meeting or Activity</button>
          </form>
        }

        {editRowForm == true && current == 'opportunities for faculty' && 
          <form className="form editing" action="POST" onSubmit={submitUpdateFacultyOpportunity}>
            <div className="form-group-single">
              <label htmlFor="title">Title</label>
              <input type="text" name="title" value={title} required onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="subtitle">Sub-title (optional)</label>
              <input type="text" name="subtitle" value={subtitle} onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="source">Source</label>
              <input type="text" name="source" value={source} onChange={handleChange} required/>
            </div>
            <div className="form-group-double">
              <div className="form-group-checkbox">
                  <label htmlFor="enabled">
                    <input type="checkbox" name="enabled" checked={!enabled} onChange={handleChange}/>
                    <span></span>
                    <div>
                      <svg>
                        <use xlinkHref="/sprite.svg#icon-checkmark"></use>
                      </svg>
                    </div>
                  </label>
                  Disable
              </div>
            </div>
            <div className="form-group-single">
              <label htmlFor="expiration">Expiration Date</label>
              <input type="date" name="expiration" value={expiration} placeholder="mm / dd / yyyy" onChange={handleChange} required/>
            </div>
            <div className="form-group-single">
                <label htmlFor="message">Message</label>
                <ReactQuill 
                    placeholder="Write something..."
                    className="form-group-quill"
                    theme="snow"
                    name="message"
                    value={message}
                    onChange={handleQuill}
                />
            </div>
            <button type="submit" className="submit-item">Update Meeting or Activity</button>
          </form>
        }

        {editRowForm == true && current == 'opportunities for students' && 
          <form className="form editing" action="POST" onSubmit={submitUpdateStudentOpportunity}>
            <div className="form-group-single">
              <label htmlFor="title">Title</label>
              <input type="text" name="title" value={title} required onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="subtitle">Sub-title (optional)</label>
              <input type="text" name="subtitle" value={subtitle} onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="source">Source</label>
              <input type="text" name="source" value={source} onChange={handleChange} required/>
            </div>
            <div className="form-group-double">
              <div className="form-group-checkbox">
                  <label htmlFor="enabled">
                    <input type="checkbox" name="enabled" checked={!enabled} onChange={handleChange}/>
                    <span></span>
                    <div>
                      <svg>
                        <use xlinkHref="/sprite.svg#icon-checkmark"></use>
                      </svg>
                    </div>
                  </label>
                  Disable
              </div>
            </div>
            <div className="form-group-single">
              <label htmlFor="expiration">Expiration Date</label>
              <input type="date" name="expiration" value={expiration} placeholder="mm / dd / yyyy" onChange={handleChange} required/>
            </div>
            <div className="form-group-single">
                <label htmlFor="message">Message</label>
                <ReactQuill 
                    placeholder="Write something..."
                    className="form-group-quill"
                    theme="snow"
                    name="message"
                    value={message}
                    onChange={handleQuill}
                />
            </div>
            <button type="submit" className="submit-item">Update Meeting or Activity</button>
          </form>
        }

        {success !== null && editRowForm == true && <div className="form-successMessage">{success}</div>}
        {error !== null && editRowForm == true && <div className="form-errorMessage">{error}</div>}
        
      </div>
    </div>
    </>
  )
}

ViewAll.getInitialProps = async ({query, req}) => {
  console.log(query.viewAll)
  const token = getToken('accessToken', req)
  let accessToken = null
  if(token){
    accessToken = token.split('=')[1]
  }

  switch (query.viewAll) {
    case 'announcements':
      const announcementsResponse = await axios.get(`${API}/announcement/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          contentType: `application/json`
        }
      })

      // CHANGE CREATEDAT DATE FORMAT TO YYYY-MM-DD
      parseCreatedAtDates(announcementsResponse.data)

      return {
        allContent: announcementsResponse.data,
        current: query.viewAll
      }
      
      break;
    case 'meetings and activities':
      const meetingsResponse = await axios.get(`${API}/meetings/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          contentType: `application/json`
        }
      })

      // CHANGE CREATEDAT DATE FORMAT TO YYYY-MM-DD
      parseExpirationDates(meetingsResponse.data)
      parseCreatedAtDates(meetingsResponse.data)

      return {
        allContent: meetingsResponse.data,
        current: query.viewAll
      }
      break;

    case 'opportunities for faculty':
      const facultyOpportunitiesResponse = await axios.get(`${API}/opportunities-faculty/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          contentType: `application/json`
        }
      })

      // CHANGE CREATEDAT DATE FORMAT TO YYYY-MM-DD
      parseExpirationDates(facultyOpportunitiesResponse.data)
      parseCreatedAtDates(facultyOpportunitiesResponse.data)

      return {
        allContent: facultyOpportunitiesResponse.data,
        current: query.viewAll
      }
      break;

    case 'opportunities for students':
      const studentOpportunitiesResponse = await axios.get(`${API}/opportunities-students/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          contentType: `application/json`
        }
      })

      // CHANGE CREATEDAT DATE FORMAT TO YYYY-MM-DD
      parseExpirationDates(studentOpportunitiesResponse.data)
      parseCreatedAtDates(studentOpportunitiesResponse.data)

      return {
        allContent: studentOpportunitiesResponse.data,
        current: query.viewAll
      }
      break;

    default:
      break;
  }
}

export default withAdmin(ViewAll)
