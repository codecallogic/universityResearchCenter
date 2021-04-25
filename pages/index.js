import React, {useState, useEffect, useRef} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import Nav from '../components/nav'
import Slider from '../components/slider/slider'
import axios from 'axios'
import {API} from '../config'
import {parseCreatedAtDates, parseExpirationDates, sortByCreationDate, sortByExpirationDate, sortByEnableAndCreationDate, selectOne} from '../helpers/sort'

const Home = ({announcements, meetings, facultyOpportunities, studentOpportunities, headerData, studentProfiles}) => {
  
  const [announcementsList, setAnnouncementsList] = useState(announcements)
  const [meetingsList, setList] = useState(meetings)
  const [facultyOpportunitiesList, setFacultyOpportunities] = useState(facultyOpportunities)
  const [studentOpportunitiesList, setStudentOpportunities] = useState(studentOpportunities)
  const [announcementModal, setAnnouncementModal] = useState(null)
  const [generalModal, setGeneralModal] = useState(null)
  const [modalType, setModalType] = useState(null)

  const ref = useRef()
  const router = useRouter()

  const createAnnouncementModal = (e) => {
    setAnnouncementModal(e)
  }

  const createGeneralModal = (e) => {
    setGeneralModal(e)
  }

  const handleClickOutside = (e) => {
    if(ref.current && !ref.current.contains(e.target)){
      setAnnouncementModal(null)
      setGeneralModal(null)
    }
  }

  const modal = (e) => {
    setModalType(e)
  }

  const studentProfile = (e, item) => {
    window.open(`/student/${item}`, '_blank');
  }

  return (
    <>
    <Nav></Nav>
    <div className="home-container">
      <div className="home-header">
        <Slider header={headerData}></Slider>
      </div>
      <div className="home-announcements">
        <div className="home-announcements-header">
          <svg>
            <use xlinkHref="/sprite.svg#icon-announcement"></use>
          </svg>
          <span>Announcements</span>
        </div>
        <div className="home-announcements-container">
          {announcementsList !== null && 
            announcementsList.map( (item, i) =>
              item.primary === true ? 
                <div key={i}>
                <div className="home-announcements-title">
                  <svg>
                    <use xlinkHref="/sprite.svg#icon-message"></use>
                  </svg>
                  <span>{item.title}</span>
                </div>
                <div className="home-announcements-post-container">
                  <div className="home-announcements-post-left-column">
                    <span className="home-announcements-post-left-column-date">Posted: <span>{item.createdAt}</span></span>
                    <img src={`${item.imageURL}`} alt={`${item.imageDescr}`}/>
                    <span className="home-announcements-post-left-column-imageSubtitle">{item.imageDescr}</span>
                    <div className="home-announcements-post-left-column-description" dangerouslySetInnerHTML={ { __html: item.message.substring(0, 700) } }></div>
                  </div>
                  <div className="home-announcements-post-right-column-description" dangerouslySetInnerHTML={ { __html: item.message.substring(700) } }></div>
                </div>              
                </div>
                :
                null
            )
          }
          {announcementsList !== null && 
            announcementsList.map( (item, i) =>
              item.primary === false && item.enabled === true ? 
              <div key={i} className="home-announcements-item" onClick={() => createAnnouncementModal(item)}>
                <div className="home-announcements-item-title">
                  <svg>
                    <use xlinkHref="/sprite.svg#icon-message"></use>
                  </svg>
                  <div className="home-announcements-item-title-group">
                    <h6>{item.title}</h6>
                    <span>Posted: <strong>{item.createdAt}</strong></span>
                  </div>
                </div>
              </div>
            :
            null
            )
          }
        </div>
      </div>
      <div className="home-box-left">
        <div className="home-meetings">
          <div className="home-meetings-header">
            <svg>
              <use xlinkHref="/sprite.svg#icon-calendar"></use>
            </svg>
            <span>Meetings and Activities</span>
          </div>
          <div className="home-meetings-container">
            {meetingsList !== null && 
              meetingsList.map( (item, i) =>
                item.enabled === true ? 
                <div key={i} className="home-meetings-item" onClick={() => { createGeneralModal(item); modal('meetings and activities');}}>
                  <div className="home-meetings-item-title">
                    <svg>
                      <use xlinkHref="/sprite.svg#icon-calendar"></use>
                    </svg>
                    <div className="home-meetings-item-title-group">
                      <h6>{item.title}</h6>
                      {item.expiration !== 'no expiration' ? <span>Expires: <strong>{item.expiration}</strong></span> : <span>Posted: <strong>{item.createdAt}</strong></span>}
                      </div>
                    </div>
                </div>
              :
              null
              )
            }
          </div> 
        </div>
        {studentProfiles[0] && 
          <div className="home-student-spotlight">
          <div className="home-student-spotlight-header">
            <svg>
              <use xlinkHref="/sprite.svg#icon-user-tie"></use>
            </svg>
            <span>Student Spotlight</span>
          </div>
          <div>
            {studentProfiles[0] && 
              studentProfiles.map( (item, i) =>
                item.enabled == true ? 
                <div key={i} className="home-student-spotlight-item" onClick={(e) => studentProfile(e, item._id)}>
                  <div className="home-student-spotlight-item-students">
                    {/* <div>
                    <svg>
                      <use xlinkHref="/sprite.svg#icon-user-tie"></use>
                    </svg>
                    </div> */}
                    <div className="home-student-spotlight-item-group">
                      <div className="home-student-spotlight-item-group-image">
                        <img src={item.photo} alt={item.firstName}/>
                      </div>
                      <div className="home-student-spotlight-item-group-info">
                        <h6>{item.firstName} {item.lastName} ({item.institution}), Department of {item.department}</h6>
                        <span>{item.activity} for {item.areaOfStudy}</span>
                        <div className="home-student-spotlight-item-group-info-details">
                          <div>
                            <svg>
                              <use xlinkHref="/sprite.svg#icon-mail"></use>
                            </svg>
                            <div>Email: <a href="#">{item.email}</a></div>
                          </div>
                          <div>
                            <svg>
                              <use xlinkHref="/sprite.svg#icon-linkedin"></use>
                            </svg>
                            <div>LinkedIn: <a href="#"> {item.linkedIn.substring(0, 30)}</a></div>
                          </div>
                          <div>
                            <svg>
                              <use xlinkHref="/sprite.svg#icon-label_outline"></use>
                            </svg>
                            <div>Research Interests:
                              {item.researchInterests.map( (item, i) => (
                                <a key={i} href="#">{item.tag}</a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                :
                null
              )
            }
          </div>
        </div>
      }
      </div>

      <div className="home-box-right">
        <div className="home-opportunities-faculty">
          <div className="home-opportunities-faculty-header">
            <svg>
              <use xlinkHref="/sprite.svg#icon-briefcase"></use>
            </svg>
            <span>Opportunities for Faculty</span>
          </div>
          <div>
            {facultyOpportunitiesList !== null && 
              facultyOpportunitiesList.map( (item, i) =>
                item.enabled === true ? 
                <div key={i} className="home-opportunities-item" onClick={() => { createGeneralModal(item); modal('opportunities for faculty');}}>
                  <div className="home-opportunities-item-title">
                    <div>
                    <svg>
                      <use xlinkHref="/sprite.svg#icon-briefcase"></use>
                    </svg>
                    </div>
                    <div className="home-opportunities-item-title-group">
                      <h6>{item.title}</h6>
                      {item.expiration !== 'no expiration' ? <span>Expires: <strong>{item.expiration}</strong></span> : <span>Posted: <strong>{item.createdAt}</strong></span>}
                    </div>
                  </div>
                </div>
              :
              null
              )
            }
          </div>
        </div>
        <div className="home-opportunities-students">
          <div className="home-opportunities-students-header">
            <svg>
              <use xlinkHref="/sprite.svg#icon-briefcase"></use>
            </svg>
            <span>Opportunities for Student Fellows</span>
          </div>
          <div>
            {studentOpportunitiesList !== null && 
              studentOpportunitiesList.map( (item, i) =>
                item.enabled === true ? 
                <div key={i} className="home-opportunities-item" onClick={() => { createGeneralModal(item); modal('opportunities for students');}}>
                  <div className="home-opportunities-item-title-students">
                    <div>
                    <svg>
                      <use xlinkHref="/sprite.svg#icon-school"></use>
                    </svg>
                    </div>
                    <div className="home-opportunities-item-title-group">
                      <h6>{item.title}</h6>
                      {item.expiration !== 'no expiration' ? <span>Expires: <strong>{item.expiration}</strong></span> : <span>Posted: <strong>{item.createdAt}</strong></span>}
                    </div>
                  </div>
                </div>
              :
              null
              )
            }
          </div>
        </div>
      </div>

      {announcementModal !== null && 
      <div className="bg-modal" onClick={handleClickOutside}>
        <div className="modal-content" ref={ref}>
          <div className="modal-content-heading">
            <div className="modal-content-heading-breadcrumb announcements-heading">
              <svg>
                <use xlinkHref="/sprite.svg#icon-message"></use>
              </svg>
              <span>Announcements</span>
            </div>
            <h2 className="modal-content-heading-subtitle announcements-heading">{announcementModal.subtitle}</h2>
            <h1 className="modal-content-heading-title announcements-heading">{announcementModal.title}</h1>
            <div className="modal-content-heading-date announcements-heading">Posted: <span>{announcementModal.createdAt}</span></div>
          </div>
          <div className="modal-content-constant">Message from the Director:</div>
          <div className="modal-content-message" dangerouslySetInnerHTML={ { __html: announcementModal.message} }></div>
        </div>
        <svg className="bg-modal-icon" onClick={handleClickOutside}>
          <use xlinkHref="sprite.svg#icon-cross"></use>
        </svg>
      </div>
      }

      {generalModal !== null && 
      <div className="bg-modal" onClick={handleClickOutside}>
        <div className="modal-content" ref={ref}>
          <div className={`modal-content-heading ${modalType}`}>
            <div className="modal-content-heading-breadcrumb">
              <svg>
                <use xlinkHref={`/sprite.svg#icon-${modalType}`}></use>
              </svg>
              <span>{modalType}</span>
            </div>
            <h2 className="modal-content-heading-subtitle">{generalModal.subtitle}</h2>
            <h1 className="modal-content-heading-title">{generalModal.title}</h1>
            <div className="modal-content-heading-date">Posted: <span>{generalModal.createdAt}</span></div>
          </div>
          <div className="modal-content-constant">Message from the Director:</div>
          <div className="modal-content-message small-padding" dangerouslySetInnerHTML={ { __html: generalModal.message} }></div>
          <div className="modal-content-source">Source: <a href={generalModal.source}>{generalModal.source}</a></div>
        </div>
        <svg className="bg-modal-icon" onClick={handleClickOutside}>
          <use xlinkHref="sprite.svg#icon-cross"></use>
        </svg>
      </div>
      }
    </div>
    </>
  )
}

Home.getInitialProps = async () => {
  const announcements = await axios.get(`${API}/announcement/public/list`)
  const meetings = await axios.get(`${API}/meetings/public/list`)
  const facultyOpportunities = await axios.get(`${API}/opportunities-faculty/public/list`)
  const studentOpportunities = await axios.get(`${API}/opportunities-students/public/list`)
  const headerComponent = await axios.get(`${API}/header-component/public`)
  const studentProfiles = await axios.get(`${API}/student-profiles/public`)

  // CHANGE CREATEDAT DATE FORMAT TO YYYY-MM-DD
  parseCreatedAtDates(announcements.data)
  parseCreatedAtDates(meetings.data)
  parseExpirationDates(meetings.data)
  parseCreatedAtDates(facultyOpportunities.data)
  parseExpirationDates(facultyOpportunities.data)
  parseCreatedAtDates(studentOpportunities.data)
  parseExpirationDates(studentOpportunities.data)

  // SORT ANNOUNCEMENTS BY DATE POSTED
  let newAnnouncements = sortByCreationDate(announcements.data)
  let newMeetings = sortByExpirationDate(meetings.data)
  let newFacultyOpportunties = sortByExpirationDate(facultyOpportunities.data)
  let newStudentOpportunties = sortByExpirationDate(studentOpportunities.data)

  // SORT HEADER SLIDER BY ENABLED AND DATE
  let newHeaderComponent = sortByEnableAndCreationDate(headerComponent.data)

  // SELECT DATA
  let randomSelectedStudent = selectOne(studentProfiles.data)
  let id = randomSelectedStudent[0]._id
  
  const student = await axios.post(`${API}/student-profile/find/public`, {id})
  let studentArray = new Array(student.data)

  return {
    announcements: newAnnouncements,
    meetings: newMeetings,
    facultyOpportunities: newFacultyOpportunties,
    studentOpportunities: newStudentOpportunties,
    headerData: newHeaderComponent,
    studentProfiles: studentArray
  }
}

export default Home