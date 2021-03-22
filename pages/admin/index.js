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
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'

// TODO: Create front end protected url routes using SSR for Admin

const Dashboard = ({loggedIn, account, authorization, header, student}) => {

  const dispatch = useDispatch()
  const router = useRouter()
  const inputTags = useRef()

  const [form, setForm] = useState('announcements')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedIndexComponent, setSelectedIndexComponent] = useState(0)
  const [selectedIndexProfile, setSelectedIndexProfile] = useState(0)
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

  // Handle change for header form
  const handleChangeRedux = (e) => {
    setTags(e.target.value)
    
    // HANDLE CHANGE FOR HEADER
    dispatch({
      type: 'UPDATE_STATE_HEADER',
      payload: {name: e.target.name, value: e.target.value}
    })

    // HANDLE CHANGE FOR STUDENT PROFILE
    dispatch({
      type: 'UPDATE_STATE_STUDENT',
      payload: {name: e.target.name, value: e.target.value}
    })
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  // HANDLE KEY PRESS
  const handleKeyPress = (e) => {    
    if(e.key === 'Enter'){
      e.preventDefault();
      manageTags()
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

  // Handle announcement form
  const handleAnnouncementMessage = (e) => {
    setContent({...content, message: e})
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const viewAll = () => {
    if(form == 'announcements') window.location.href = `/admin/view/${form}`
    if(form == 'meetings and activities') window.location.href = `/admin/view/${form}`
    if(form == 'opportunities for faculty') window.location.href = `/admin/view/${form}`
    if(form == 'opportunities for students') window.location.href = `/admin/view/${form}`
    if(form == 'header') window.location.href = `/admin/view/${form}`
  }
  
  const handleForms = (e) => {
    e.target.classList.contains('form-selection-boxes') === true ? (setSelectedIndex(e.target.options.selectedIndex), setDropDowns('boxes', e.target.options.selectedIndex)) : null

    e.target.classList.contains('form-selection-components') === true ? (setSelectedIndexComponent(e.target.options.selectedIndex), setDropDowns('components', e.target.options.selectedIndex)) : null

    e.target.classList.contains('form-selection-profiles') === true ? (setSelectedIndexProfile(e.target.options.selectedIndex), setDropDowns('profiles', e.target.options.selectedIndex)) : null

    setForm(e.target.value.toLowerCase())

    setContent({...content, title: '', subtitle: '', imageURL: '', imageDescr: '', primary: false, source: '', message: ''})
  }

  // Submit form to create an announcement
  const createAnnouncement = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/announcement/create`, {content}, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setContent({...content, title:"", subtitle:"", imageURL:"", imageDescr:""})
      setContent({...content, message:""})
      setSuccessMessage(response.data)
    } catch (error) {
      setErrorMessage(error.response.error)
    } 
  }

  // Submit form to create an meeting
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
  
  // Submit form to create an opportunity for faculty
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

  // Submit form to create an opportunity for student
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

  // Submit form to create an opportunity for student
  const createSpotlight = async (e) => {
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

  // Update Header
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
                <option value="spotlight">Spotlight</option>
              </select>             
            </div>
            <div className="dashboard-left-panel-title">Components</div>
            <div className="dashboard-left-panel-group">
              <select className="dashboard-control form-selection-components" onChange={handleForms}>
                <option value="select a component" disabled>Select a component</option>
                <option value="header">Header</option>
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
              <div className="form-group-double">
                <label htmlFor="image">Image URL</label>
                <input type="text" name="imageURL" value={imageURL} onChange={handleChange} required/>
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
          {form === 'spotlight' &&
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
          }
          {form === 'header' &&
          <div className="dashboard-right-panel">
            <div className="dashboard-right-panel-toggle" onClick={viewAll}>View All Header Slides</div>
            <form className="form" action="POST" onSubmit={createHeader}>
              <div className="form-group-single">
                <label htmlFor="headline">Headline</label>
                <input type="text" name="headline" value={header.headline} onChange={handleChangeRedux} required/> 

                <label htmlFor="subheading">Subheading</label>
                <input type="text" name="subheading" value={header.subheading} onChange={handleChangeRedux} required/> 

                <label htmlFor="button1">Button</label>
                <input type="text" name="button" value={header.button} onChange={handleChangeRedux} required/> 

                <label htmlFor="imageLeftColumn">Image Left Column</label>
                <input type="text" name="imageLeftColumn" value={header.imageLeftColumn} onChange={handleChangeRedux} required/>

                <label htmlFor="imageRightColumn">Image Right Column</label>
                <input type="text" name="imageRightColumn" value={header.imageRightColumn} onChange={handleChangeRedux} required/>

                <label htmlFor="captionOne">Caption 1</label>
                <input type="text" name="captionOne" value={header.captionOne} onChange={handleChangeRedux} required/> 

                <label htmlFor="captionTwo">Caption 2</label>
                <input type="text" name="captionTwo" value={header.captionTwo} onChange={handleChangeRedux}/> 
              </div>
              <button type="submit" className="submit-item">Create Header Slide</button>
            </form>
            {errorMessage !== null && <div className="form-errorMessage">{errorMessage}</div>}
            {successMessage !== null && <div className="form-successMessage">{successMessage}</div>}
          </div>
          }
          {form === 'student' &&
          <div className="dashboard-right-panel">
            <div className="dashboard-right-panel-toggle" onClick={viewAll}>View All Student Profiles</div>
            <form className="form" action="POST" onSubmit={createSpotlight}>
              <div className="form-group-single">
                <label htmlFor="photo">Photo</label>
                <input type="text" name="photo" value={student.photo} onChange={handleChangeRedux} required/>
              </div>
              <div className="form-group-double">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" value={student.name} onChange={handleChangeRedux} required/>
              </div>
              <div className="form-group-double">
                <label htmlFor="linkedin">LinkedIn</label>
                <input type="text" name="linkedin" value={student.linkedin} onChange={handleChangeRedux} required/>
              </div>
              <div className="form-group-single">
                <label htmlFor="tags">Research Interests</label>
                <input type="hidden" name="tags" id="tagValue" value="" required></input>
                <div className="form-tag-container">
                  <input type="text" id="researchInterests" name="tags" ref={inputTags} value={tags} onKeyPress={handleKeyPress} onChange={handleChangeRedux} required/>
                </div>
              </div>
              <button className="submit-item">Create Opportunity for Students</button>
            </form>
            {errorMessage !== null && <div className="form-errorMessage">{errorMessage}</div>}
            {successMessage !== null && <div className="form-successMessage">{successMessage}</div>}
          </div>
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
      student: state.studentProfile
  }
}

export default connect(mapStateToProps)(withAdmin(Dashboard))
