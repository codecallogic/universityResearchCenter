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
            announcementsList.slice(0,1).map( (item) => 
              <span>{item.title}</span>
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

  return {
    announcements: announcements.data
  }
}

export default Home