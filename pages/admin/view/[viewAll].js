import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {API, PUBLIC_FILES} from '../../../config'
import withAdmin from '../../withAdmin'
import {useRouter} from 'next/router'
import AdminNav from '../../../components/admin/adminNav'
import {connect} from 'react-redux'
import { useDispatch } from 'react-redux';
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'
axios.defaults.withCredentials = true


// HELPERS
import {getToken} from '../../../helpers/auth'
import {parseCreatedAtDates, parseUpdatedAtDates, parseExpirationDates, removeHeadersSliderComponent, removeHeadersStudentProfile, generateURL} from '../../../helpers/sort'
import {manageTags} from '../../../helpers/forms'

// COMPONENTS
import StudentProfile from '../../../components/admin/forms/edit/editStudentProfile'
import Webpage from '../../../components/admin/forms/edit/editWebpage'

const ViewAll = ({account, allContent, authorization, current, studentList, pureStudentList, edit}) => {

  const router = useRouter()
  const dispatch = useDispatch()

  const [newContent, setNewContent] = useState(pureStudentList)
  const [user, setUser] = useState(JSON.parse(decodeURIComponent(account)))
  const [content, setContent] = useState(
    allContent ? allContent : studentList 
  )
  const [headers, setHeaders] = useState(
    allContent && allContent.length > 0 ? Object.keys(allContent[0]) : studentList ? Object.keys(studentList[0]) : null
  )
  const [selected, setSelected] = useState([])
  const [asc, setAsc] = useState(-1)
  const [desc, setDesc] = useState(1)
  const [editRowForm, setEditRowForm] = useState(false)
  const [updatedRow, setUpdatedRow] = useState({
    id: '',
    title: '',
    subtitle: '',
    imageURL: '',
    file: '',
    imageDescr: '',
    source: '',
    expiration: '',
    primary: false,
    enabled: true,
    message: '',
    headline: '',
    subheading: '',
    button: '',
    buttonLink: '',
    imageLeftColumn: '',
    imageRightColumn: '',
    captionOne: '',
    captionTwo: '',
  })
  const [tags, setTags] = useState('')
  const [messages, setMessage] = useState({
    error: null,
    success: null
  })
  const {error, success} = messages
  const {title, subtitle, imageURL, imageDescr, source, expiration, primary, enabled, message, headline, subheading, button, buttonLink, imageLeftColumn, imageRightColumn, captionOne, captionTwo} = updatedRow

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
      
      case 'enabled':
        let filterEnabled = content.sort( (a, b) => {
          let textA = a.enabled;
          let textB = b.enabled;
          return textA < textB ? asc : desc
        })

        elGetAttribute.indexOf('desc') > -1 
        ? 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-asc'),
        newArray = [...filterEnabled],
        setContent(newArray),
        setAsc(1),
        setDesc(-1)
        )
        : 
        (elGetElement.setAttribute('xlink:href', '/sprite.svg#icon-chevron-thin-desc'),
        newArray = [...filterEnabled],
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
  const editRow = async () => {
    setMessage({...messages, error: '', success: ''})
    for(let i = 0; i < content.length; i++){
      if(content[i]._id == selected[0]){
        setEditRowForm(true)
        setUpdatedRow({...updatedRow, id: content[i]._id, title: content[i].title,  subtitle: content[i].subtitle, imageURL: content[i].imageURL, imageDescr: content[i].imageDescr, source: content[i].source, expiration: content[i].expiration, primary: content[i].primary, enabled: content[i].enabled, message: content[i].message, headline: content[i].headline, subheading: content[i].subheading, button: content[i].button, buttonLink: content[i].buttonLink,imageLeftColumn: content[i].imageLeftColumn, imageRightColumn: content[i].imageRightColumn, captionOne: content[i].captionOne, captionTwo: content[i].captionTwo})

        let id = selected[0]
        let studentProfile = []

        try {
          current === 'student' ?
          ( 
            studentProfile = await axios.post(`${API}/student-profile/find`, {id}, {
              headers: {
                Authorization: `Bearer ${authorization}`,
                contentType: `application/json`
              }
            }),
            manageTags('interests', studentProfile.data.researchInterests),
            handleKeyPress(null, 'init'),

            studentProfile.data ?
              (
              studentProfile.data.researchInterests = [],
              dispatch({
                type: 'SET_EDIT_STUDENT',
                payload: {content: studentProfile.data, selected: selected[0]}
              })
              )
            : window.location.reload()
          )
          : null
        } catch (error) {
          window.location.reload()
        }

        current === 'webpage' ? 
          dispatch({
            type: 'SET_EDIT_WEBPAGE',
            payload: {content: content[i], selected: selected[0]}
          })
          :
          null
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

  // HANDLE CHANGE STUDENT PROFILE
  const handleChangeStudentProfile = (e) => {
    e.target.name === 'tags' ? setTags(e.target.value) : null

    e.target.name === 'enabled' ? 
    dispatch({
      type: 'EDIT_STATE_ENABLED',
      payload: {name: e.target.name, value: !e.target.checked}
    })

    :

    // HANDLE CHANGE FOR STUDENT PROFILE
    dispatch({
      type: 'EDIT_STATE_STUDENT',
      payload: {name: e.target.name, value: e.target.files ? e.target.files[0] : e.target.value}
    })

    setMessage({...message, error: null, success: null})
  }

  // HANDLE KEY PRESS
  const handleKeyPress = (e, run) => {    
    if(e){
      if(e.key === 'Enter'){
        // CHECK IF NEW TAG EXISTS IN DELETE TAG STATE. IF SO REMOVE TAG FROM tagsToRemove ARRAY
        e.preventDefault();

        if(edit.tagsToRemove){
          dispatch({
            type: 'REMOVE_TAG_FROM_TAGS_TO_REMOVE_ARRAY',
            payload: e.target.value
          })
        }
        
        manageTags('addTag')
        let closeIcon = document.querySelectorAll('.form-tag')
        let postHidden = document.getElementById("tagValue")
        let values = postHidden.getAttribute('value').split(',')

        closeIcon.forEach( (e) => {
          e.addEventListener('click', function(e){
            let parent = e.target.parentNode
            let parentOfParent = parent.parentNode
            parentOfParent.remove()

            let tagValues = document.querySelectorAll(".tag > span")
            let newValues = []
            
            tagValues.forEach( e => {
              newValues.push(e.innerHTML)
            })

            dispatch({
              type: 'EDIT_RESEARCH_INTERESTS',
              payload: newValues
            })
          })
        })

        dispatch({
          type: 'EDIT_RESEARCH_INTERESTS',
          payload: values
        })
        setTags('')
      }
    }

    if(run == 'init'){
      let closeIcon = document.querySelectorAll('.form-tag')
      closeIcon.forEach( (e) => {
        e.addEventListener('click', function(e){
          let parent = e.target.parentNode
          let parentOfParent = parent.parentNode
          parentOfParent.remove()

          let tagValues = document.querySelectorAll(".tag > span")
          let newValues = []
          
          tagValues.forEach( e => {
            newValues.push(e.innerHTML)
          })

          let tagsToDelete = new Array(parent.getAttribute('data-item'))

          dispatch({
            type: 'RESEARCH_INTERESTS_TO_BE_REMOVED',
            payload: tagsToDelete
          })

          dispatch({
            type: 'EDIT_RESEARCH_INTERESTS',
            payload: newValues
          })
        })
      })
    }

  }

  // HANDLE PROFILE STUDENT BOXES
  const handleStudentProfileBoxes = (e, content) => {
    // HANDLE CHANGE FOR STUDENT PROFILE
    dispatch({
      type: 'EDIT_STATE_STUDENT',
      payload: {name: content, value: e}
    })
  }

  const handleWebpage = (e, type) => {
    // HANDLE CHANGE FOR WEBPAGE STATE
    type == 'regular' ? 
      dispatch({
        type: 'EDIT_STATE_WEBPAGE',
        payload: {name: e.target.name, value: e.target.value}
      }) : null

    // HANDLE CHANGE FOR WEBPAGE CONTENT
    type == 'content' ? 
      dispatch({
        type: 'EDIT_STATE_WEBPAGE_CONTENT',
        payload: {name: 'content', value: e}
      }) : null
  }

  // SUBMIT UPDATED FOR ANNOUNCEMENT ROW CONTENT
  const submitUpdateAnnouncement = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/announcement/update`, data, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setContent(response.data)
      setMessage({...messages, success: 'Update was made successfully'})
    } catch (error) {
      console.log(error)
      console.log(error.response.data)
      error.response ? error.response.data ? setMessage({...messages, error: error.response.data}) : null : null
      if(error.response) error.response.statusText ? error.response.statusText == 'Unauthorizeed' ? window.location.href = '/admin/login' : null : null
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
      console.log(error)
      if(error.response.statusText === 'Unauthorized') window.location.href = '/admin/login'
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
      if(error.response.statusText === 'Unauthorized') window.location.href = '/admin/login'
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
      if(error.response.statusText === 'Unauthorized') window.location.href = '/admin/login'
      setMessage({...messages, error: error.response})
    }
  }

  const submitUpdateHeader = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/header-component/update`, updatedRow, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setMessage({...messages, success: 'Update was made successfully'})
      setContent(response.data)
    } catch (error) {
      console.log(error.response)
      if(error.response.statusText === 'Unauthorized') window.location.href = '/admin/login'
      setMessage({...messages, error: error.response})
    }
  }

  const submitUpdateStudentProfile = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('file', edit.file)
    for( let key in edit){
      if(key !== 'file') data.append(key, edit[key])
    }
    try {
      const response = await axios.post(`${API}/student-profile/update`, data, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })

      let updatedContent = content.map( (item, i) => {
        if(item._id == response.data._id) item = response.data
        return item
      })
      setContent(updatedContent)

      let id = edit._id

      // DATA WITHOUT JSON KEY PROPERTIES REMOVED
      const pureResponse = await axios.post(`${API}/student-profile/find`, {id}, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })

      let updatedPureContent = newContent.map( (item, i) => {
        if(item._id == pureResponse.data._id) item['researchInterests'] = pureResponse.data.researchInterests
        return item
      })
      
      setNewContent(updatedPureContent)
      setMessage({...messages, success: 'Update was made successfully'})
    } catch (error) {
      console.log(error)
      if(error.response.statusText === 'Unauthorized') window.location.href = '/admin/login'
      setMessage({...messages, error: error.response ? error.response.data : error})
    }
  }

  const submitUpdateWebpage = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/webpage/update`, {edit}, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setMessage({...messages, success: 'Update was made successfully'})
      generateURL(response.data)
      setContent(response.data)
    } catch (error) {
      console.log(error.response)
      if(error.response.statusText === 'Unauthorized') window.location.href = '/admin/login'
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

      case 'header':
        const responseHeader = await axios.post(`${API}/header-component/delete`, selected, {
          headers: {
            Authorization: `Bearer ${authorization}`,
            contentType: `application/json`
          }
        })
        parseCreatedAtDates(responseHeader.data)
        removeHeaders(responseHeader.data)
        setContent(responseHeader.data)
        break;
      
      case 'student':
        const responseStudentProfile = await axios.post(`${API}/student-profile/delete`, selected, {
          headers: {
            Authorization: `Bearer ${authorization}`,
            contentType: `application/json`
          }
        })

        removeHeadersStudentProfile(responseStudentProfile.data)
        setContent(responseStudentProfile.data)
        
        break;

      case 'webpage':
        const webpageResponse = await axios.post(`${API}/webpage/delete`, selected, {
          headers: {
            Authorization: `Bearer ${authorization}`,
            contentType: `application/json`
          }
        })

        // CHANGE CREATEDAT AND UPDATEDAT FORMAT TO YYYY-MM-DD
        parseCreatedAtDates(webpageResponse.data)
        parseUpdatedAtDates(webpageResponse.data)
        generateURL(webpageResponse.data)
        setContent(webpageResponse.data)
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
      setMessage({...messages, success: 'Row was deleted successfully'})
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
    parseExpirationDates(content, current)

    // REMOVE HEADERS
    current === 'header' ? removeHeadersSliderComponent(content): null
    current === 'student' ? removeHeadersStudentProfile(content) : null

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
          {/* {editRowForm == false && 
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
          } */}
          {headers !== null && editRowForm == false && headers.map( (header, i) => (
          header !== 'primary' && header !== '__v' && header !== '_id' && header !== 'buttonLink' ? 
            <div key={i} className="content-table-headers-heading">
              {header}
              {/* 
              TODO: Add filtering if client needs its 
              FIXME: Change which column can be filtered in ternary operator
              */}
              {header == 'title' || header == 'subtitle' || header == 'createdAt' || header == 'expiration' || header == 'enabled'?
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
          keyName !== '__v' && keyName !== 'primary' && keyName !== '_id' && keyName !== 'buttonLink' ?  
            // (console.log(item),
            // console.log(keyName))
            <div key={keyIndex} className="content-table-rows-content">
              <span>
                {keyName == 'url' ? <a target="_blank" href={item['url']}>{item['url'].toString().substring(0, 50)}</a> : 
                item[keyName].toString().length > 50 ?
                item[keyName].toString().substring(0, 50): 
                item[keyName].toString()}
            </span>
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
                <label htmlFor="file">Image</label>
                <input type="file" name="file" className="form-group-file" onChange={(e) => setUpdatedRow({...updatedRow, file: e.target.files[0]})}/>
            </div>
            <div className="form-group-double form-group-double-image">
                <label htmlFor="file">Current Image</label>
                <img src={`${PUBLIC_FILES}/${imageURL}`} alt=""/>
            </div>
            <div className="form-group-single">
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

        {editRowForm == true && current == 'header' && 
          <form className="form editing" action="POST" onSubmit={submitUpdateHeader}>
            <div className="form-group-single">
              <label htmlFor="headline">Headline</label>
              <input type="text" name="headline" value={headline} required onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="subheading">Subheading</label>
              <input type="text" name="subheading" value={subheading} onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="button">Button</label>
              <input type="text" name="button" value={button} onChange={handleChange} required/>
            </div>
            <div className="form-group-single">
              <label htmlFor="buttonLink">Button Link</label>
              <input type="text" name="buttonLink" value={buttonLink} onChange={handleChange} required/>
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
              <label htmlFor="imageLeftColumn">Image Left Column (600 x 500 px minimum)</label>
              <input type="text" name="imageLeftColumn" value={imageLeftColumn} onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="imageRightColumn">Image Right Column (1280 x 500 px minimum)</label>
              <input type="text" name="imageRightColumn" value={imageRightColumn} onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="captionOne">Caption One</label>
              <input type="text" name="captionOne" value={captionOne} onChange={handleChange}/>
            </div>
            <div className="form-group-single">
              <label htmlFor="captionTwo">Caption Two</label>
              <input type="text" name="captionTwo" value={captionTwo} onChange={handleChange}/>
            </div>
            <button type="submit" className="submit-item">Update Header</button>
          </form>
        }

        {editRowForm == true && current == 'student' && 
          <StudentProfile submitUpdateStudentProfile={submitUpdateStudentProfile} student={edit} handleKeyPress={handleKeyPress} handleChangeStudentProfile={handleChangeStudentProfile} handleStudentProfileBoxes={handleStudentProfileBoxes} tags={tags}/>
        }

        {editRowForm == true && current == 'webpage' && 
          <Webpage submitUpdateWebpage={submitUpdateWebpage} webpage={edit} handleWebpage={handleWebpage}/>
        }

        {success !== null && editRowForm == true && <div className="form-successMessage">{success}</div>}
        {error !== null && editRowForm == true && <div className="form-errorMessage">{error}</div>}
        
      </div>
    </div>
    </>
  )
}

const mapStateToProps = state => {
  return {
      edit: state.editRow
  }
}

ViewAll.getInitialProps = async ({query, req}) => {
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

    case 'header':
      let headerComponentResponse = await axios.get(`${API}/header-component/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          contentType: `application/json`
        }
      })

      // CHANGE CREATEDAT DATE FORMAT TO YYYY-MM-DD
      parseCreatedAtDates(headerComponentResponse.data)
      removeHeadersSliderComponent(headerComponentResponse.data)

      return {
        allContent: headerComponentResponse.data,
        current: query.viewAll
      }
      break;
    
    case 'student':
      let studentListResponse = await axios.get(`${API}/student-profile/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          contentType: `application/json`
        }
      })

      let pureStudentListResponse = await axios.get(`${API}/student-profile/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          contentType: `application/json`
        }
      })

      // CHANGE CREATEDAT DATE FORMAT TO YYYY-MM-DD
      parseCreatedAtDates(studentListResponse.data)
      removeHeadersStudentProfile(studentListResponse.data)

      return {
        studentList: studentListResponse.data,
        pureStudentList: pureStudentListResponse.data,
        current: query.viewAll
      }
      break;

    case 'webpage':
      let webpageResponse = await axios.get(`${API}/webpage/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          contentType: `application/json`
        }
      })

      // CHANGE CREATEDAT AND UPDATEDAT FORMAT TO YYYY-MM-DD
      parseCreatedAtDates(webpageResponse.data)
      parseUpdatedAtDates(webpageResponse.data)
      generateURL(webpageResponse.data)
      
      return {
        allContent: webpageResponse.data,
        current: query.viewAll
      }

      break;

    default:
      break;
  }
}

export default connect(mapStateToProps)(withAdmin(ViewAll))
