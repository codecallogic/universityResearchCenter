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
  const [user, setUser] = useState(JSON.parse(decodeURIComponent(account)))
  const [announcement, setAnnouncements] = useState({
    title: '',
    subtitle: '',
    imageURL: '',
    imageDescr: '',
    message: ''
  })
  const {title, subtitle, imageURL, imageDescr, message} = announcement
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Handle announcement form
  const handleChange = (e) => {
    setAnnouncements({...announcement, [e.target.name]: e.target.value})
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  // Handle announcement form
  const handleAnnouncementMessage = (e) => {
    setAnnouncements({...announcement, message: e})
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  // Submit form to create an announcement
  const createAnnouncement = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API}/announcement/create`, {announcement}, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })
      setAnnouncements({...announcement, title:"", subtitle:"", imageURL:"", imageDescr:""})
      setAnnouncements({...announcement, message:""})
      setSuccessMessage(response.data)
    } catch (error) {
      setErrorMessage(error.response.error)
    } 
  }

  const viewAll = () => {
    if(form == 'announcements') window.location.href = `/admin/view/${form}`
  }
  
  return (
    <>
    {loggedIn && <div>
      <AdminNav data={user}></AdminNav>
        <div className="dashboard">
          <div className="dashboard-left-panel">
            <div className="dashboard-left-panel-title">Homepage Modals</div>
            <div className="dashboard-left-panel-group">              
              <div className="dashboard-control active-control">Announcements</div>
              <div className="dashboard-control">Announcements</div>
              <div className="dashboard-control">Announcements</div>
              <div className="dashboard-control">Announcements</div>
              <div className="dashboard-control">Announcements</div>
              <div className="dashboard-control">Announcements</div>
            </div>
          </div>
          {form === 'announcements' &&
          <div className="dashboard-right-panel">
            <div className="dashboard-right-panel-toggle" onClick={viewAll}>View All</div>
            <form className="dashboard-form" action="POST" onSubmit={createAnnouncement}>
              <div className="dashboard-form-group-single">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" value={title} onChange={handleChange} required/>
              </div>
              <div className="dashboard-form-group-single">
                <label htmlFor="subtitle">Sub-title (optional)</label>
                <input type="text" name="subtitle" value={subtitle} onChange={handleChange}/>
              </div>
              <div className="dashboard-form-group-double">
                <label htmlFor="image">Image URL</label>
                <input type="text" name="imageURL" value={imageURL} onChange={handleChange} required/>
              </div>
              <div className="dashboard-form-group-double">
                <label htmlFor="title">Image Short Description</label>
                <input type="text" name="imageDescr" value={imageDescr} onChange={handleChange} required/>
              </div>
              <div className="dashboard-form-group-single">
                  <label htmlFor="message">Message</label>
                  <ReactQuill 
                      placeholder="Write something..."
                      className="dashboard-form-group-quill"
                      theme="snow"
                      name="message"
                      onChange={handleAnnouncementMessage}
                      value={message}
                      
                  />
              </div>
              <button type="submit" className="submit-announcement">Create Anouncement</button>
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
