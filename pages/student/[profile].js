import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {API} from '../../config'

// COMPONENTS
import Nav from '../../components/nav'

const StudentProfile = ({studentProfile}) => {
  
  useEffect(() => {
    console.log(studentProfile)
  }, [])
  
  return (
    <>
    <Nav></Nav>
    <div className="student-profile-container">
      <div className="student-profile">
        <div className="student-profile-record">
          <div className="student-profile-record-image">
            <img src={studentProfile.photo} alt={studentProfile.areaOfStudy}/>
          </div>
          <div className="student-profile-record-details">
            <h1>{studentProfile.firstName} {studentProfile.lastName}, {studentProfile.activity}</h1>
            <h2>{studentProfile.institution}, Department of {studentProfile.department}, {studentProfile.areaOfStudy}</h2>
            <div className="student-profile-record-details-info">
              <div>
                <svg>
                  <use xlinkHref="/sprite.svg#icon-mail"></use>
                </svg>
                <div>Email: {studentProfile.email}</div>
              </div>
              <div>
                <svg>
                  <use xlinkHref="/sprite.svg#icon-linkedin"></use>
                </svg>
                <div>LinkedIn: <a href={studentProfile.linkedIn}> {studentProfile.linkedIn}</a></div>
              </div>
              <div>
                <svg>
                  <use xlinkHref="/sprite.svg#icon-label_outline"></use>
                </svg>
                <div>Research Interests:
                  {studentProfile.researchInterests.map( (item) => (
                    <a href="#">{item}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="student-profile-record-bio">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem nulla voluptatibus adipisci fugit earum hic iure omnis delectus ducimus ea magni possimus rerum veritatis minus deserunt, et nesciunt, cupiditate voluptates?
        </div>
        </div>
    </div>
    </>
  )
}

StudentProfile.getInitialProps = async ({query, req}) => {
  const studentProfileResponse = await axios.get(`${API}/student-profile/${query.profile}`)

  return {
    studentProfile: studentProfileResponse.data
  }
  
}

export default StudentProfile
