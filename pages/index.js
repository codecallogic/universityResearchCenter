import React, {useState, useEffect, useRef} from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import axios from 'axios'
import {API} from '../config'
import {parseCreatedAtDates, parseExpirationDates, sortByCreationDate, sortByExpirationDate} from '../helpers/sort'

const Home = ({announcements, meetings, opportunities}) => {
  
  const [announcementsList, setAnnouncementsList] = useState(announcements)
  const [meetingsList, setList] = useState(meetings)
  const [opportunitiesList, setOpportunities] = useState(opportunities)
  const [announcementModal, setAnnouncementModal] = useState(null)
  const [generalModal, setGeneralModal] = useState(null)
  const [modalType, setModalType] = useState(null)

  const ref = useRef()

  const createAnnouncementModal = (e) => {
    setAnnouncementModal(e)
  }

  const createGeneralModal = (e) => {
    setGeneralModal(e)
  }

  const handleClickOutside = (e) => {
    console.log(ref.current)
    if(ref.current && !ref.current.contains(e.target)){
      setAnnouncementModal(null)
      setGeneralModal(null)
    }
  }

  const modal = (e) => {
    setModalType(e)
  }

  return (
    <>
    <Nav></Nav>
    <div className="home-container">
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
                    <h6>Message from the director:</h6>
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
                  <div>
                  <svg>
                    <use xlinkHref="/sprite.svg#icon-calendar"></use>
                  </svg>
                  </div>
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

      <div className="home-opportunities">
        <div className="home-opportunities-header">
          <svg>
            <use xlinkHref="/sprite.svg#icon-briefcase"></use>
          </svg>
          <span>Opportunities for Faculty</span>
        </div>
        <div className="home-opportunities-container">
          {opportunitiesList !== null && 
            opportunitiesList.map( (item, i) =>
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

      {announcementModal !== null && 
      <div className="bg-modal" onClick={handleClickOutside}>
        <div className="modal-content" ref={ref}>
          <div className="modal-content-heading">
            <div className="modal-content-heading-breadcrumb">
              <svg>
                <use xlinkHref="/sprite.svg#icon-message"></use>
              </svg>
              <span>Announcements</span>
            </div>
            <h2 className="modal-content-heading-subtitle">{announcementModal.subtitle}</h2>
            <h1 className="modal-content-heading-title">{announcementModal.title}</h1>
            <div className="modal-content-heading-date">Posted: <span>{announcementModal.createdAt}</span></div>
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
  const opportunities = await axios.get(`${API}/opportunities/public/list`)

  // CHANGE CREATEDAT DATE FORMAT TO YYYY-MM-DD
  parseCreatedAtDates(announcements.data)
  parseCreatedAtDates(meetings.data)
  parseExpirationDates(meetings.data)
  parseCreatedAtDates(opportunities.data)
  parseExpirationDates(opportunities.data)

  // SORT ANNOUNCEMENTS BY DATE POSTED
  let newAnnouncements = sortByCreationDate(announcements.data)
  let newMeetings = sortByExpirationDate(meetings.data)
  let newOpportunties = sortByExpirationDate(opportunities.data)

  return {
    announcements: newAnnouncements,
    meetings: newMeetings,
    opportunities: newOpportunties
  }
}

export default Home