import React, {useState, useEffect, useRef} from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import axios from 'axios'
import {API} from '../config'

const Home = ({announcements}) => {
  
  const [announcementsList, setAnnouncementsList] = useState(announcements)
  const [modal, setModal] = useState(null)

  const ref = useRef()

  const createModal = (e) => {
    setModal(e)
  }

  const handleClickOutside = (e) => {
    if(ref.current && !ref.current.contains(e.target)){
      setModal(null)
    }
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
              <div key={i} className="home-announcements-item" onClick={() => createModal(item)}>
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
          {announcementsList !== null && 
            announcementsList.map( (item, i) =>
              item.primary === false && item.enabled === true ? 
              <div key={i} className="home-meetings-item" onClick={() => createModal(item)}>
                <div className="home-meetings-item-title">
                  <svg>
                    <use xlinkHref="/sprite.svg#icon-calendar"></use>
                  </svg>
                  <div className="home-meetings-item-title-group">
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
      <div className="home-opportunities">
        <div className="home-opportunities-header">
          <svg>
            <use xlinkHref="/sprite.svg#icon-briefcase"></use>
          </svg>
          <span>Opportunities for Faculty</span>
        </div>
        <div className="home-opportunities-container">
          {announcementsList !== null && 
            announcementsList.map( (item, i) =>
              item.primary === false && item.enabled === true ? 
              <div key={i} className="home-opportunities-item" onClick={() => createModal(item)}>
                <div className="home-opportunities-item-title">
                  <svg>
                    <use xlinkHref="/sprite.svg#icon-message"></use>
                  </svg>
                  <div className="home-opportunities-item-title-group">
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
      {modal !== null && 
      <div className="bg-modal" onClick={handleClickOutside}>
        <div className="modal-content" ref={ref}>
          <div className="modal-content-heading">
            <div className="modal-content-heading-breadcrumb">
              <svg>
                <use xlinkHref="/sprite.svg#icon-message"></use>
              </svg>
              <span>Announcements</span>
            </div>
            <h2 className="modal-content-heading-subtitle">{modal.subtitle}</h2>
            <h1 className="modal-content-heading-title">{modal.title}</h1>
            <div className="modal-content-heading-date">Posted: <span>{modal.createdAt}</span></div>
          </div>
          <div className="modal-content-constant">Message from the Director:</div>
          <div className="modal-content-message" dangerouslySetInnerHTML={ { __html: modal.message} }></div>
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

  // CHANGE CREATEDAT DATE FORMAT TO YYYY-MM-DD
  let newResults = announcements.data.map( date => {
    let now = new Date(date.createdAt)
    date.createdAt = now.toISOString().slice(0,10)
    return date
  })

  // SORT ANNOUNCEMENTS BY DATE POSTED
  let newArray = []
  let filterDates = announcements.data.sort( (a, b) => {
    return (new Date(b.createdAt) - new Date(a.createdAt)) > -1 ? 1 : -1;
  })
  newArray = [...filterDates]

  return {
    announcements: newArray
  }
}

export default Home