import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {API} from '../../../config'
import withAdmin from '../../withAdmin'
import {useRouter} from 'next/router'
import AdminNav from '../../../components/admin/adminNav'
import {getToken} from '../../../helpers/auth'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'
axios.defaults.withCredentials = true

const ViewAll = ({account, allAnnouncements, authorization}) => {

  const router = useRouter()

  const [user, setUser] = useState(JSON.parse(decodeURIComponent(account)))
  const [announcements, setAnnouncements] = useState(allAnnouncements)
  const [headers, setHeaders] = useState(Object.keys(allAnnouncements[0]))
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
    primary: false,
    enabled: true,
    message: ''
  })
  const [messages, setMessage] = useState({
    error: null,
    success: null
  })

  const {error, success} = messages
  const {title, subtitle, imageURL, imageDescr, primary, enabled, message} = updatedRow

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
          return textA < textB ? asc : desc
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
          return textA < textB ? asc : desc
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
    for(let i = 0; i < announcements.length; i++){
      if(announcements[i]._id == selected[0]){
        setEditRowForm(true)
        setUpdatedRow({...updatedRow, id: announcements[i]._id, title: announcements[i].title,  subtitle: announcements[i].subtitle, imageURL: announcements[i].imageURL, imageDescr: announcements[i].imageDescr, primary: announcements[i].primary, enabled: announcements[i].enabled, message: announcements[i].message})
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

  // SUBMIT UPDATED ROW CONTENT
  const submitUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/announcement/update`, updatedRow, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setAnnouncements(response.data)
      setMessage({...messages, success: 'Update was made successfully'})
    } catch (error) {
      setMessage({...messages, error: response.data.error})
    }
  }

  const deleteRow = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/announcement/delete`, selected, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setSelected([])
      setAnnouncements(response.data)
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
    console.log(announcements)
    setEditRowForm(false)
  }
  
  return (
    <>
    <AdminNav data={user}></AdminNav>
    <div className="announcements">
      <h1 className="announcements-header">All Announcements</h1>
      <div className="announcements-table">
        {editRowForm == false && 
          <div className="announcements-table-buttons">
            <button className={ selected.length >= 1 ? 'enabled ' : null} disabled={selected.length >= 1 ? false: true}onClick={deleteRow}>Delete</button>
            <button className={ selected.length == 1 ? 'enabled ' : null} disabled={selected.length == 1 ? false: true} onClick={editRow}>Edit</button>
          </div>
        }

        {editRowForm == true && 
          <div className="announcements-table-buttons">
            <button className="enabled" onClick={viewAllButton}>View All</button>
          </div>
        }
        
        <div className="announcements-table-headers">
          {editRowForm == false && 
          <div className="announcements-table-group">
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
            <div key={i} className="announcements-table-headers-heading">
              {header}
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
          : null
          ))
          }
        </div>

        {announcements !== null && editRowForm == false && announcements.map( (announcement, i) => (
        <div key={i} className="announcements-table-rows">
          <div className="announcements-table-group">
            <label htmlFor="selectAll">
              <input type="checkbox" id={announcement._id} value={announcement._id} onClick={rowClicked}/>
              <span></span>
              <div>
                <svg>
                  <use xlinkHref="/sprite.svg#icon-checkmark"></use>
                </svg>
              </div>
            </label>
          </div>
          {Object.keys(announcement).map( (keyName, keyIndex) => (
          keyName !== '__v' && keyName !== 'primary' && keyName !== 'enabled'  ?  
            <div key={keyIndex} className="announcements-table-rows-content">
              <span>
              {announcement[keyName].toString().length > 50 ?  
              announcement[keyName].toString().substring(0, 50): 
              announcement[keyName].toString()
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

        {editRowForm == true &&
          <form className="form editing" action="POST" onSubmit={submitUpdate}>
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
            <button type="submit" className="submit-announcement">Update Anouncement</button>
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

  console.log(response.data)
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
