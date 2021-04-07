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
            <h1>{studentProfile.firstName} {studentProfile.lastName}, {studentProfile.areaOfStudy}</h1>
            <h2>{studentProfile.activity} at {studentProfile.institution}</h2>
            <h3>Department of {studentProfile.department}</h3>
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
                <div>LinkedIn: <a href={studentProfile.linkedIn}> {studentProfile.linkedIn.substring(0, 50)}</a></div>
              </div>
              <div>
                <svg>
                  <use xlinkHref="/sprite.svg#icon-label_outline"></use>
                </svg>
                <div>Research Interests:
                  {studentProfile.researchInterests.map( (item, i) => (
                    <a key={i} href="#">{item.tag}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="student-profile-toggle">
          {Object.keys(studentProfile).map( (item, i) => 
            {return item == 'biography' || item == 'education' || item == 'research' || item == 'publication'
              ?
              <div key={i}>
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
              </div>
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
  console.log(studentProfileResponse)

  return {
    studentProfile: studentProfileResponse.data
  }
  
}

export default StudentProfile
