import React, {useState, useEffect, useRef} from 'react'
import withAdmin from '../withAdmin'
import {useRouter} from 'next/router'
import AdminNav from '../../components/admin/adminNav'
import {API} from '../../config'
import {connect} from 'react-redux'
import { useDispatch } from 'react-redux';
import axios from 'axios'
import {setDropDowns} from '../../helpers/sort'
import {manageTags} from '../../helpers/forms'
import StudentProfile from '../../components/admin/forms/studentProfile'
import Webpage from '../../components/admin/forms/webpage'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'

// TODO: Create front end protected url routes using SSR for Admin

const Dashboard = ({loggedIn, account, authorization, header, student, webpage}) => {

  const dispatch = useDispatch()
  const router = useRouter()

  const [form, setForm] = useState('announcements')
  const [user, setUser] = useState(JSON.parse(decodeURIComponent(account)))
  const [content, setContent] = useState({
    title: '',
    subtitle: '',
    imageURL: '',
    imageDescr: '',
    primary: false,
    source: '',
    expiration: '',
    message: '',
  })
  const {title, subtitle, imageURL, imageDescr, source, expiration, message} = content
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [tags, setTags] = useState('')

  // Handle change for box forms
  const handleChange = (e) => {
    e.target.name == 'primary' ? setContent({...content, [e.target.name]: e.target.checked}) : null
    e.target.name !== 'primary' ? setContent({...content, [e.target.name]: e.target.value}) : null
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  // HANDLE CHANGE FOR HEADER
  const handleChangeHeader = (e) => {
    dispatch({
      type: 'UPDATE_STATE_HEADER',
      payload: {name: e.target.name, value: e.target.value}
    })

    setSuccessMessage(null)
    setErrorMessage(null)
  }


  // HANDLE CHANGE STUDENT PROFILE
  const handleChangeStudentProfile = (e) => {
    e.target.name === 'tags' ? setTags(e.target.value) : null

    // HANDLE CHANGE FOR STUDENT PROFILE
    dispatch({
      type: 'UPDATE_STATE_STUDENT',
      payload: {name: e.target.name, value: e.target.files ? e.target.files[0] : e.target.value}
    })

    setSuccessMessage(null)
    setErrorMessage(null)
  }

  // HANDLE KEY PRESS
  const handleKeyPress = (e) => {    
    if(e.key === 'Enter'){
      e.preventDefault();
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
            type: 'UPDATE_RESEARCH_INTERESTS',
            payload: newValues
          })
        })
      })

      dispatch({
        type: 'UPDATE_RESEARCH_INTERESTS',
        payload: values
      })
      setTags('')
    }
  }

  // HANDLE ANNOUNCEMENT FORM MESSAGE
  const handleAnnouncementMessage = (e) => {
    setContent({...content, message: e})
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  // HANDLE WEBPAGE STATE
  const handleWebpage = (e, type) => {
    type === 'regular' ? 
      dispatch({
        type: 'UPDATE_STATE_WEBPAGE',
        name: 'heading',
        payload: e.target.value
      })

      :

      dispatch({
        type: 'UPDATE_STATE_WEBPAGE',
        name: 'content',
        payload: e
      })
  }

  // HANDLE PROFILE STUDENT BOXES
  const handleStudentProfileBoxes = (e, content) => {
    // HANDLE CHANGE FOR STUDENT PROFILE
    dispatch({
      type: 'UPDATE_STATE_STUDENT',
      payload: {name: content, value: e}
    })
  }

  const viewAll = (e) => {
    if(form == 'announcements') window.location.href = `/admin/view/${form}`
    if(form == 'meetings and activities') window.location.href = `/admin/view/${form}`
    if(form == 'opportunities for faculty') window.location.href = `/admin/view/${form}`
    if(form == 'opportunities for students') window.location.href = `/admin/view/${form}`
    if(form == 'header') window.location.href = `/admin/view/${form}`
    if(form == 'student') window.location.href = `/admin/view/${form}`
    if(form == 'webpage') window.location.href = `/admin/view/${form}`
  }
  
  const handleForms = (e) => {
    e.target.classList.contains('form-selection-boxes') === true ? setDropDowns('boxes', e.target.options.selectedIndex) : null

    e.target.classList.contains('form-selection-components') === true ? setDropDowns('components', e.target.options.selectedIndex) : null

    e.target.classList.contains('form-selection-profiles') === true ? setDropDowns('profiles', e.target.options.selectedIndex) : null

    setForm(e.target.value.toLowerCase())

    setContent({...content, title: '', subtitle: '', imageURL: '', imageDescr: '', primary: false, source: '', message: ''})
  }

  // CREATE AN ANNOUNCEMENT
  const createAnnouncement = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('file', content.imageURL)

    for( const key in content){
      if(key !== 'imageURL') data.append(key, content[key])
    }
    
    try {
      const response = await axios.post(`${API}/announcement/create`, data, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `multipart/form-data`
        }
      })
      setContent({...content, title:"", subtitle:"", imageURL:"", imageDescr:""})
      setContent({...content, message:""})
      setSuccessMessage(response.data)
    } catch (error) {
      setErrorMessage(error.response.error)
    } 
  }

  // CREATE A MEETING
  const createMeeting = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/meeting/create`, {content}, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setContent({...content, title: '', subtitle: '', expiration: '', source: ''})
      setContent({...content, message:""})
      setSuccessMessage(response.data)
    } catch (error) {
      setErrorMessage(error.response.data)
    }
  }
  
  // CREATE OPPORTUNITY FOR FACULTY
  const createOpportunityForFaculty = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/opportunity-faculty/create`, {content}, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setContent({...content, title: '', subtitle: '', expiration: '', source: ''})
      setContent({...content, message:""})
      setSuccessMessage(response.data)
    } catch (error) {
      setErrorMessage(error.response.data)
    }
  }

  // CREATE OPPORTUNITY FOR STUDENT
  const createOpportunityForStudent = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/opportunity-students/create`, {content}, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setContent({...content, title: '', subtitle: '', expiration: '', source: ''})
      setContent({...content, message:""})
      setSuccessMessage(response.data)
    } catch (error) {
      setErrorMessage(error.response.data)
    }
  }

  // CREATE SPOTLIGHT ANNOUNCEMENT
  const createSpotlight = async (e) => {
    //
  }

  // CREATE HEADER
  const createHeader = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/header-component/create`, {header}, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      dispatch({
        type: 'RESET_STATE'
      })
      setSuccessMessage(response.data)
    } catch (error) {
      setErrorMessage(error.response.data)
    }
  }

  // CREATE STUDENT PROFILE
  const createStudentProfile = async (e) => {
    e.preventDefault()
    console.log(student)
    const data = new FormData()
    data.append('file', student.file)
    for( let key in student){
      if(key !== 'file') data.append(key, student[key])
    }
    
    try {
      const response = await axios.post(`${API}/student-profile/create`, data, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `multipart/form-data`
        }
      })
      dispatch({
        type: 'RESET_STATE'
      })

      let closeIcon = document.querySelectorAll('.tag')
      closeIcon.forEach( (e) => {
        e.remove()
      })

      setSuccessMessage(response.data)
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response.data)
    }
  }

  const createWebpage = async (e) => {
    console.log('Hello')
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/webpage/create`, {webpage}, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contenType: `application/json`
        }
      })
      setSuccessMessage(response.data)
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response.data)
    }
  }

  useEffect( () => {
    setDropDowns(null, null)
  }, [])
  
  return (
    <>
    {loggedIn && <div>
      <AdminNav data={user}></AdminNav>
        <div className="dashboard">
          <div className="dashboard-left-panel">
            <div className="dashboard-left-panel-title">Homepage Boxes</div>
            <div className="dashboard-left-panel-group">
              <select className="dashboard-control form-selection-boxes" onChange={handleForms}>
                <option value="select a box" disabled>Select a box</option>
                <option value="announcements">Announcements</option>
                <option value="meetings and activities">Meetings and Activities</option>
                <option value="opportunities for faculty">Opportunities for Faculty</option>
                <option value="opportunities for students">Opportunities for Students</option>
                {/* <option value="spotlight">Spotlight</option> */}
              </select>             
            </div>
            <div className="dashboard-left-panel-title">Components</div>
            <div className="dashboard-left-panel-group">
              <select className="dashboard-control form-selection-components" onChange={handleForms}>
                <option value="select a component" disabled>Select a component</option>
                <option value="header">Header</option>
                <option value="webpage">Webpage</option>
              </select>             
            </div>
            <div className="dashboard-left-panel-title">Profiles</div>
            <div className="dashboard-left-panel-group">
              <select className="dashboard-control form-selection-profiles" onChange={handleForms}>
                <option value="select a profile" disabled>Select a profile</option>
                <option value="student">Student Profile</option>
              </select>            
            </div>
          </div>
          {form === 'announcements' &&
          <div className="dashboard-right-panel">
            <div className="dashboard-right-panel-toggle" onClick={viewAll}>View All Announcements</div>
            <form className="form" action="POST" onSubmit={createAnnouncement}>
              <div className="form-group-single">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" value={title} onChange={handleChange} required/>
              </div>
              <div className="form-group-single">
                <label htmlFor="subtitle">Sub-title (optional)</label>
                <input type="text" name="subtitle" value={subtitle} onChange={handleChange}/>
              </div>
              <div className="form-group-single">
                <div className="form-group-checkbox">
                  <label htmlFor="primary">
                    <input type="checkbox" name="primary" onChange={handleChange}/>
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
              <div className="form-group-single">
                <label htmlFor="file">Image</label>
                <input type="file" name="file" className="form-group-file" onChange={(e) => setContent({...content, imageURL: e.target.files[0]})}/>
              </div>
              <div className="form-group-double">
                <label htmlFor="title">Image Short Description</label>
                <input type="text" name="imageDescr" value={imageDescr} onChange={handleChange} required/>
              </div>
              <div className="form-group-single">
                  <label htmlFor="message">Message</label>
                  <ReactQuill 
                      placeholder="Write something..."
                      className="form-group-quill"
                      theme="snow"
                      name="message"
                      onChange={handleAnnouncementMessage}
                      value={message}
                      
                  />
              </div>
              <button type="submit" className="submit-item">Create Anouncement</button>
            </form>
            {errorMessage !== null && <div className="form-errorMessage">{errorMessage}</div>}
            {successMessage !== null && <div className="form-successMessage">{successMessage}</div>}
          </div>
          }
          {form === 'meetings and activities' &&
          <div className="dashboard-right-panel">
            <div className="dashboard-right-panel-toggle" onClick={viewAll}>View All Meetings and Activities</div>
            <form className="form" action="POST" onSubmit={createMeeting}>
              <div className="form-group-single">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" value={title} onChange={handleChange} required/>
              </div>
              <div className="form-group-single">
                <label htmlFor="subtitle">Sub-title (optional)</label>
                <input type="text" name="subtitle" value={subtitle} onChange={handleChange}/>
              </div>
              <div className="form-group-double">
                <label htmlFor="source">Source</label>
                <input type="text" name="source" value={source} onChange={handleChange} required/>
              </div>
              <div className="form-group-double">
                <label htmlFor="expiration">Expiration Date (Optional)</label>
                <input type="date" name="expiration" value={expiration} placeholder="mm / dd / yyyy" onChange={handleChange}/>
              </div>
              <div className="form-group-single">
                  <label htmlFor="message">Message</label>
                  <ReactQuill 
                      placeholder="Write something..."
                      className="form-group-quill"
                      theme="snow"
                      name="message"
                      onChange={handleAnnouncementMessage}
                      value={message}
                      required
                  />
              </div>
              <button type="submit" className="submit-item">Create Meeting or Activity</button>
            </form>
            {errorMessage !== null && <div className="form-errorMessage">{errorMessage}</div>}
            {successMessage !== null && <div className="form-successMessage">{successMessage}</div>}
          </div>
          }
          {form === 'opportunities for faculty' &&
          <div className="dashboard-right-panel">
            <div className="dashboard-right-panel-toggle" onClick={viewAll}>View All Opportunities for Faculty</div>
            <form className="form" action="POST" onSubmit={createOpportunityForFaculty}>
              <div className="form-group-single">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" value={title} onChange={handleChange} required/>
              </div>
              <div className="form-group-single">
                <label htmlFor="subtitle">Sub-title (optional)</label>
                <input type="text" name="subtitle" value={subtitle} onChange={handleChange}/>
              </div>
              <div className="form-group-double">
                <label htmlFor="source">Source</label>
                <input type="text" name="source" value={source} onChange={handleChange} required/>
              </div>
              <div className="form-group-double">
                <label htmlFor="expiration">Expiration Date (Optional)</label>
                <input type="date" name="expiration" value={expiration} placeholder="mm / dd / yyyy" onChange={handleChange}/>
              </div>
              <div className="form-group-single">
                  <label htmlFor="message">Message</label>
                  <ReactQuill 
                      placeholder="Write something..."
                      className="form-group-quill"
                      theme="snow"
                      name="message"
                      onChange={handleAnnouncementMessage}
                      value={message}
                      required
                  />
              </div>
              <button type="submit" className="submit-item">Create Opportunity for Faculty</button>
            </form>
            {errorMessage !== null && <div className="form-errorMessage">{errorMessage}</div>}
            {successMessage !== null && <div className="form-successMessage">{successMessage}</div>}
          </div>
          }
          {form === 'opportunities for students' &&
          <div className="dashboard-right-panel">
            <div className="dashboard-right-panel-toggle" onClick={viewAll}>View All Opportunities for Students</div>
            <form className="form" action="POST" onSubmit={createOpportunityForStudent}>
              <div className="form-group-single">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" value={title} onChange={handleChange} required/>
              </div>
              <div className="form-group-single">
                <label htmlFor="subtitle">Sub-title (optional)</label>
                <input type="text" name="subtitle" value={subtitle} onChange={handleChange}/>
              </div>
              <div className="form-group-double">
                <label htmlFor="source">Source</label>
                <input type="text" name="source" value={source} onChange={handleChange} required/>
              </div>
              <div className="form-group-double">
                <label htmlFor="expiration">Expiration Date (Optional)</label>
                <input type="date" name="expiration" value={expiration} placeholder="mm / dd / yyyy" onChange={handleChange}/>
              </div>
              <div className="form-group-single">
                  <label htmlFor="message">Message</label>
                  <ReactQuill 
                      placeholder="Write something..."
                      className="form-group-quill"
                      theme="snow"
                      name="message"
                      onChange={handleAnnouncementMessage}
                      value={message}
                      required
                  />
              </div>
              <button type="submit" className="submit-item">Create Opportunity for Students</button>
            </form>
            {errorMessage !== null && <div className="form-errorMessage">{errorMessage}</div>}
            {successMessage !== null && <div className="form-successMessage">{successMessage}</div>}
          </div>
          }
          {/* {form === 'spotlight' &&
          <div className="dashboard-right-panel">
            <div className="dashboard-right-panel-toggle" onClick={viewAll}>View All Spotlight Announcements</div>
            <form className="form" action="POST" onSubmit={createSpotlight}>
              <div className="form-group-single">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" value={title} onChange={handleChange} required/>
              </div>
              <div className="form-group-double">
                <label htmlFor="source">Source</label>
                <input type="text" name="source" value={source} onChange={handleChange} required/>
              </div>
              <div className="form-group-double">
                <label htmlFor="expiration">Expiration Date (Optional)</label>
                <input type="date" name="expiration" value={expiration} placeholder="mm / dd / yyyy" onChange={handleChange}/>
              </div>
              <button type="submit" className="submit-item">Create Opportunity for Students</button>
            </form>
            {errorMessage !== null && <div className="form-errorMessage">{errorMessage}</div>}
            {successMessage !== null && <div className="form-successMessage">{successMessage}</div>}
          </div>
          } */}
          {form === 'header' &&
          <div className="dashboard-right-panel">
            <div className="dashboard-right-panel-toggle" onClick={viewAll}>View All Header Slides</div>
            <form className="form" action="POST" onSubmit={createHeader}>
              <div className="form-group-single">
                <label htmlFor="headline">Headline</label>
                <input type="text" name="headline" value={header.headline} onChange={handleChangeHeader} required/> 

                <label htmlFor="subheading">Subheading</label>
                <input type="text" name="subheading" value={header.subheading} onChange={handleChangeHeader} required/> 

                <label htmlFor="button1">Button</label>
                <input type="text" name="button" value={header.button} onChange={handleChangeHeader} required/>

                <label htmlFor="buttonLink">Button Link</label>
                <input type="text" name="buttonLink" value={header.buttonLink} onChange={handleChangeHeader} required/> 

                <label htmlFor="imageLeftColumn">Image Left Column (600 x 500 px minimum)</label>
                <input type="text" name="imageLeftColumn" value={header.imageLeftColumn} onChange={handleChangeHeader} required/>

                <label htmlFor="imageRightColumn">Image Right Column (1280 x 500 px minimum)</label>
                <input type="text" name="imageRightColumn" value={header.imageRightColumn} onChange={handleChangeHeader} required/>

                <label htmlFor="captionOne">Caption 1</label>
                <input type="text" name="captionOne" value={header.captionOne} onChange={handleChangeHeader} required/> 

                <label htmlFor="captionTwo">Caption 2 (Optional)</label>
                <input type="text" name="captionTwo" value={header.captionTwo} onChange={handleChangeHeader}/> 
              </div>
              <button type="submit" className="submit-item">Create Header Slide</button>
            </form>
            {errorMessage !== null && <div className="form-errorMessage">{errorMessage}</div>}
            {successMessage !== null && <div className="form-successMessage">{successMessage}</div>}
          </div>
          }
          {form === 'webpage' &&
            <Webpage viewAll={viewAll} createWebpage={createWebpage} errorMessage={errorMessage} successMessage={successMessage} webpage={webpage} handleWebpage={handleWebpage}/>
          }
          {form === 'student' &&
            <StudentProfile viewAll={viewAll} createStudentProfile={createStudentProfile} errorMessage={errorMessage} successMessage={successMessage} student={student} handleKeyPress={handleKeyPress} handleChangeStudentProfile={handleChangeStudentProfile} handleStudentProfileBoxes={handleStudentProfileBoxes} tags={tags}/>
          }
        </div>
      </div>
    }
    </>
  )
}

const mapStateToProps = state => {
  return {
      header: state.header,
      student: state.studentProfile,
      webpage: state.webpage
  }
}

export default connect(mapStateToProps)(withAdmin(Dashboard))
