import {useEffect} from 'react'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'

// HELPERS
import {manageTags} from '../../../../helpers/forms'

// REDUX
import {connect} from 'react-redux'
import { useDispatch } from 'react-redux';

const StudentProfile = ({submitUpdateStudentProfile, student, handleKeyPress, handleChangeStudentProfile, handleStudentProfileBoxes, tags}) => {

  const dispatch = useDispatch()

  useEffect(() => {
    manageTags('init')
    let closeIcon = document.querySelectorAll('.form-tag')

    closeIcon.forEach( (e) => {
      e.addEventListener('click', function(e){
        let parent = e.target.parentNode
        let parentOfParent = parent.parentNode
        parentOfParent.remove()

        let tagValues = document.querySelectorAll(".tag > span")
        let newValues = []
        
        tagValues.forEach( e => {
          newValues.push(e.innerHTML)
        })
        
        dispatch({
          type: 'EDIT_RESEARCH_INTERESTS',
          payload: newValues
        })
      })
    })
    }, [])
  
  return (
      <form className="form editing" action="POST" onSubmit={(e) => submitUpdateStudentProfile(e)}>
        <div className="form-group-single">
          <label htmlFor="photo">Photo URL</label>
          <input type="text" name="photo" value={student.photo} onChange={(e) => handleChangeStudentProfile(e)} required/>
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
          <label htmlFor="linkedIn">LinkedIn</label>
          <input type="text" name="linkedIn" value={student.linkedIn} onChange={(e) => handleChangeStudentProfile(e)} required/>
        </div>
        <div className="form-group-single">
          <label htmlFor="tags">Research Interests (Press enter to add)</label>
          <input type="hidden" id="database" value={student.researchInterests.join(',')} required></input>
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
        <button className="submit-item">Update Student Profile</button>
      </form>
  )
}

const mapStateToProps = state => {
  return state
}

export default (connect(mapStateToProps))(StudentProfile)
