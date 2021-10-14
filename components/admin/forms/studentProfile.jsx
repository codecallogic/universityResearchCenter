
import React, {useState, useEffect, useRef} from 'react'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'
import {nanoid} from 'nanoid'
import {API} from '../../../config'
import axios from 'axios'
import {connect} from 'react-redux'

const StudentProfile = ({viewAll, errorMessage, setErrorMessage, setSuccessMessage, successMessage, student, handleKeyPress, handleChangeStudentProfile, handleStudentProfileBoxes, tags, loading, setLoading, authorization, resetState}) => {

  const getRandomLower = () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
  }
   
  const getRandomUpper = () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
  }

  const getRandomNumber = () => {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48)
  }

  const getRandomSymbol = () => {
    const symbols = '!@#$%^&*(){}[]=<>/,.'
    return symbols[Math.floor(Math.random() * symbols.length)]
  }

  const randomFunc = () => {
    let numbersAvailable = [1, 2, 3, 4];
    let randomSort = []
    let res = numbersAvailable.sort( () => {
      return .5 - Math.random()
    })
    
    return res
  }

  const generatePassword = () => {
    let password = ''
    for(let i = 0; i <= 3; i += 1){
      password
      let allFunc = [
        {lower: getRandomLower()},
        {upper: getRandomUpper()},
        {number: getRandomNumber()},
        {symbol: getRandomSymbol()}
      ]
      let funcSort = randomFunc()
      funcSort.forEach((item) => {
        password += Object.values(allFunc[item - 1])[0]
      })
    }
    return password
  }

  // CREATE STUDENT PROFILE
  const createStudentProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    let fileID = nanoid()
    // console.log(student)
    const data = new FormData()
    student.file ? data.append('file', student.file, `student-${fileID}.${student.file.name.split('.')[1]}`) : resetState()
    data.append('nanoid',fileID)

    let password = generatePassword()
    student.password = password

    for( let key in student){
      if(key !== 'file') data.append(key, student[key])
    }
    
    try {
      const response = await axios.post(`${API}/student-profile/create`, data, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `multipart/form-data`
        }
      })
      setLoading(false)
      resetState()

      let closeIcon = document.querySelectorAll('.tag')
      closeIcon.forEach( (e) => {
        e.remove()
      })

      setSuccessMessage(response.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) error.response ? setErrorMessage(error.response.data) : setErrorMessage('Error occurred creating student, please try again later.')
    }
  }
  
  return (
    <div className="dashboard-right-panel">
      <div className="dashboard-right-panel-toggle" onClick={() => viewAll()}>View All Student Profiles</div>
      <form className="form" action="POST" onSubmit={(e) => createStudentProfile(e)}>
        <div className="form-group-single">
          <label htmlFor="file">Profile Photo</label>
          <input type="file" name="file" className="form-group-file" onChange={(e) => handleChangeStudentProfile(e)} required/>
        </div>
        <div className="form-group-double">
          <label htmlFor="firstName">First Name</label>
          <input type="text" name="firstName" value={student.firstName} onChange={(e) => handleChangeStudentProfile(e)} required/>
        </div>
        <div className="form-group-double">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" name="lastName" value={student.lastName} onChange={(e) => handleChangeStudentProfile(e)} required/>
        </div>
        <div className="form-group-single">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" value={student.username} onChange={(e) => handleChangeStudentProfile(e)} required/>
        </div>
        <div className="form-group-single">
          <label htmlFor="linkedIn">LinkedIn</label>
          <input type="text" name="linkedIn" value={student.linkedIn} onChange={(e) => handleChangeStudentProfile(e)} required/>
        </div>
        <div className="form-group-single">
          <label htmlFor="tags">Research Interests (Press enter to add)</label>
          <input type="hidden" name="tags" id="tagValue" value="" required></input>
          <div className="form-tag-container">
            <input type="text" id="researchInterests" name="tags" value={tags} onKeyPress={(e) => handleKeyPress(e)} onChange={(e) => handleChangeStudentProfile(e)}/>
          </div>
        </div>
        <div className="form-group-single">
          <label htmlFor="institution">Institution</label>
          <input type="text" name="institution" value={student.institution} onChange={(e) => handleChangeStudentProfile(e)} required/>
        </div>
        <div className="form-group-single">
          <label htmlFor="department">Department</label>
          <input type="text" name="department" value={student.department} onChange={(e) => handleChangeStudentProfile(e)} required/>
        </div>
        <div className="form-group-single">
          <label htmlFor="areaOfStudy">Area of Study</label>
          <input type="text" name="areaOfStudy" value={student.areaOfStudy} onChange={(e) => handleChangeStudentProfile(e)} required/>
        </div>
        <div className="form-group-single">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={student.email} onChange={(e) => handleChangeStudentProfile(e)} required/>
        </div>
        <div className="form-group-single">
          <label htmlFor="activity">Activity</label>
          <input type="text" name="activity" value={student.activity} onChange={(e) => handleChangeStudentProfile(e)} required/>
        </div>
        <div className="form-group-single">
            <label htmlFor="biography">Biography</label>
            <ReactQuill
                placeholder="Write something..."
                className="form-group-quill"
                theme="snow"
                name="biography"
                onChange={(e) => handleStudentProfileBoxes(e, 'biography')}
                value={student.biography}
                required
            />
        </div>
        <div className="form-group-single">
            <label htmlFor="education">Education</label>
            <ReactQuill
                placeholder="Write something..."
                className="form-group-quill"
                theme="snow"
                name="education"
                onChange={(e) => handleStudentProfileBoxes(e, 'education')}
                value={student.education}
                required
            />
        </div>
        <div className="form-group-single">
            <label htmlFor="research">Research</label>
            <ReactQuill
                placeholder="Write something..."
                className="form-group-quill"
                theme="snow"
                name="research"
                onChange={(e) => handleStudentProfileBoxes(e, 'research')}
                value={student.research}
                required
            />
        </div>
        <div className="form-group-single">
            <label htmlFor="publication">Publication</label>
            <ReactQuill
                placeholder="Write something..."
                className="form-group-quill"
                theme="snow"
                name="publication"
                onChange={(e) => handleStudentProfileBoxes(e, 'publication')}
                value={student.publication}
                required
            />
        </div>
        <button className="submit-item">{!loading && <span>Create Student Profile</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
      </form>
      {errorMessage !== null && <div className="form-errorMessage">{errorMessage}</div>}
      {successMessage !== null && <div className="form-successMessage">{successMessage}</div>}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    administrator: state.administrator
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetState: () => dispatch({type: 'RESET_STATE'}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile)
