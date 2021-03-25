import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {API} from '../../config'

// COMPONENTS
import Nav from '../../components/nav'

const StudentProfile = ({studentProfile}) => {

  const [activeBox, setActiveBox] = useState('')
  
  const expandBox = (text) => {
    text === activeBox ? setActiveBox('') : setActiveBox(text)
  }
  
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
                <div>Email: <a href={`mailto: ${studentProfile.email}`}>{studentProfile.email}</a></div>
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
                  {studentProfile.researchInterests.map( (item, i) => (
                    <a key={i} href="#">{item}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="student-profile-toggle">
          {Object.keys(studentProfile).map( (item) => 
            {return item == 'biography' || item == 'education' || item == 'research' || item == 'publication'
              ?
              <>
              <div className="student-profile-toggle-button" onClick={() => expandBox(item)}>
                <svg>
                  <use xlinkHref={`/sprite.svg#icon-` + (item == activeBox ? 'minus-solid' : 'add-solid')}></use>
                </svg>
                <span className={item == activeBox ? 'underline' : ''}>{item}</span>
              </div>
              {item == activeBox
                ? 
                <div className="student-profile-toggle-content" dangerouslySetInnerHTML={ { __html: studentProfile[item]} }></div>
                :
                null
              }
              </>
              :
              null
            }
          )}
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
