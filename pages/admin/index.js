import React, {useState, useEffect} from 'react'
import withAdmin from '../withAdmin'
import {useRouter} from 'next/router'
import AdminNav from '../../components/admin/adminNav'
import {API} from '../../config'
import axios from 'axios'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'

// TODO: Create front end protected url routes using SSR for Admin

const Dashboard = ({loggedIn, account, authorization}) => {
  
  const router = useRouter()

  const [form, setForm] = useState('announcements')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [user, setUser] = useState(JSON.parse(decodeURIComponent(account)))
  const [content, setContent] = useState({
    title: '',
    subtitle: '',
    imageURL: '',
    imageDescr: '',
    primary: false,
    source: '',
    expiration: '',
    message: ''
  })
  const {title, subtitle, imageURL, imageDescr, source, expiration, message} = content
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Handle announcement form
  const handleChange = (e) => {
    e.target.name == 'primary' ? setContent({...content, [e.target.name]: e.target.checked}) : null
    e.target.name !== 'primary' ? setContent({...content, [e.target.name]: e.target.value}) : null
    setSuccessMessage(null)
    setErrorMessage(null)
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
  }
  
  const handleForms = (e) => {
    setSelectedIndex(e.target.options.selectedIndex)
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

  useEffect( () => {
    const el = document.querySelectorAll('.form-selection')
    el[0].selectedIndex = selectedIndex
  })
  
  return (
    <>
    {loggedIn && <div>
      <AdminNav data={user}></AdminNav>
        <div className="dashboard">
          <div className="dashboard-left-panel">
            <div className="dashboard-left-panel-title">Homepage Boxes</div>
            <div className="dashboard-left-panel-group">
              <select className="dashboard-control form-selection" onChange={handleForms}>
                <option value="announcements">Announcements</option>
                <option value="meetings and activities">Meetings and Activities</option>
                <option value="opportunities for faculty">Opportunities for Faculty</option>
                <option value="opportunities for students">Opportunities for Students</option>
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
        </div>
      </div>
    }
    </>
  )
}

export default withAdmin(Dashboard)
