import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import axios from 'axios'
import {API} from '../config'

const Home = ({announcements}) => {
  
  const [announcementsList, setAnnouncementsList] = useState(announcements)
  
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
            announcementsList.slice(0,1).map( (item, i) => 
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
                  <div className="home-announcements-post-left-column-description" dangerouslySetInnerHTML={ { __html: item.message.substring(0, 550) } }></div>
                </div>
                <div className="home-announcements-post-right-column-description" dangerouslySetInnerHTML={ { __html: item.message.substring(550) } }></div>
              </div>              
              </div>
            )
          }
        </div>
      </div>
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

  return {
    announcements: announcements.data
  }
}

export default Home