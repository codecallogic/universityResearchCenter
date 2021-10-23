import withStudent from '../withStudent'
import Nav from '../../components/nav'
import Footer from '../../components/footer'
import {useState, useEffect} from 'react'
import SVG from '../../files/svg'
import {connect} from 'react-redux'
import axios from 'axios'
import {API, PUBLIC_FILES} from '../../config'
import {manageTags} from '../../helpers/forms'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'

const Dashboard = ({authorization, account, userInfo, navMenu, student, updateStudentProfile, updateInterests}) => {
  // console.log(JSON.parse(decodeURIComponent(account)))
  console.log(userInfo)
  const [user, setUser] = useState(userInfo)
  const [modal, setModal] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState('')
  const [dash, setDash] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    for(let key in userInfo){
      updateStudentProfile(key, userInfo[key])
    }
  }, [])

  useEffect(() => {
    if(student.file) submitStudentProfile()
  }, [student.file])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }
 
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  const sendResetPasswordLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseReset = await axios.post(`${API}/student-change-password-email`, {email: student.email, user: userInfo})
      setLoading(false)
      setError('')
      setMessage(responseReset.data)
    } catch (error) {
      setLoading(false)
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error sending reset password email')
    }
  }

  const handleKeyPress = (e) => {    
    if(e.key === 'Enter'){
      e.preventDefault();
      manageTags('addTag')
      let closeIcon = document.querySelectorAll('.form-tag')
      let postHidden = document.getElementById("tagValue")
      let values = postHidden.getAttribute('value').split(',')

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

          updateInterests(newValues)
        })
      })

      updateInterests(values)
      setTags('')
    }
  }

  useEffect(() => {

    if(dash == 'profile'){
      manageTags('interests', userInfo.researchInterests)
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
          
          updateInterests(newValues)
        })
      })
    }
  }, [dash])

  const submitStudentProfile = async () => {
    const data = new FormData()

    student.file ? data.append('file', student.file, student.photo) : null
    for( let key in student){
      if(key !== 'photo') data.append(key, student[key])
    }

    try {
      const studentUpdateResponse = await axios.post(`${API}/student-update-profile`, data, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `application/json`
        }
      })

      console.log(studentUpdateResponse)

      // let updatedContent = content.map( (item, i) => {
      //   if(item._id == response.data._id) item = response.data
      //   return item
      // })
      // setContent(updatedContent)

      // let id = edit._id

      // // DATA WITHOUT JSON KEY PROPERTIES REMOVED
      // const pureResponse = await axios.post(`${API}/student-profile/find`, {id}, {
      //   headers: {
      //     Authorization: `Bearer ${authorization}`,
      //     contentType: `application/json`
      //   }
      // })

      // let updatedPureContent = newContent.map( (item, i) => {
      //   if(item._id == pureResponse.data._id) item['researchInterests'] = pureResponse.data.researchInterests
      //   return item
      // })
      
      // setNewContent(updatedPureContent)
      // setMessage({...messages, success: 'Update was made successfully'})
      // window.location.href = '/admin/view/student'
    } catch (error) {
      console.log(error)
      if(error) error.response ? setMessage(error.response.data) : setMessage('Error ocurred updating profile.')
    }
  }
  
  return (
    <>
    <Nav navMenu={navMenu} account={account}></Nav>
      {!dash && <>
        <div className="account-student">
          <div className="account-student-breadcrumbs">
            <div className="account-student-breadcrumbs-item"><span onClick={() => window.location.href = '/'}>Home</span><SVG svg={'keyboard-right'}></SVG> <div>Account</div></div>
          </div>
          <div className="account-student-dashboard">
            <div className="account-student-dashboard-item" onClick={() => setDash('profile')}>
              <SVG svg={'user'}></SVG>
              <span>Profile</span>
            </div>
            <div className="account-student-dashboard-item" onClick={() => setModal('change_password')}>
              <SVG svg={'password'}></SVG>
              <span>Change Password</span>
            </div>
            {/* <div className="account-student-dashboard-item" onClick={() => setModal('change_email')}>
              <SVG svg={'email'}></SVG>
              <span>Change Email</span>
            </div> */}
          </div>
        </div>
      </>
      }
      {dash == 'profile' &&
        <div className="account-student">
          <div className="account-student-breadcrumbs">
            <div className="account-student-breadcrumbs-item">
              <span onClick={() => window.location.href = '/'}>Home</span>
              <SVG svg={'keyboard-right'}></SVG> 
              <span onClick={() => setDash('')}>Dashboard</span>
              <SVG svg={'keyboard-right'}></SVG> 
              <div>Profile</div>
            </div>
          </div>
          <div className="account-student-title">Profile Info</div>
          <div className="account-student-profile">
          <div className="account-student-profile-left">
            <label htmlFor="profile_image" className="account-student-profile-left-image">
              {loading !== 'user_photo' && userInfo.photo ? userInfo.photo.length > 0 ? <img src={`${PUBLIC_FILES}/${userInfo.photo}`}></img> : null : null}
              {loading == 'user_photo' ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading-profile-image" allowFullScreen></iframe> : userInfo.photo ? userInfo.photo.length < 1 ? <SVG svg={'account-circle'}></SVG> : null : <SVG svg={'account-circle'}></SVG>}
              <a>Update profile photo</a>
            </label>
            <input type="file" name="profile_image" id="profile_image" accept="image/*" onChange={(e) => (updateStudentProfile('file', e.target.files[0]))}/>
          </div>
          <div className="account-student-profile-right">
              <div className="account-student-profile-right-title">Hi, I'm {userInfo ? userInfo.username : 'Unknown'}</div>
              <form action="" className="form" onSubmit={(e) => handleProfileUpdate(e)}>
                <div className="form-group-single">
                  <label htmlFor="Username" >Username</label>
                  <input type="text" name="username" value={student.username} onChange={(e) => updateStudentProfile('username', e.target.value)}/>
                  {/* <div className="form-group-single-input">
                    <textarea id="username" rows="1" name="username" placeholder="(username)" onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Username)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} value={student.username} onChange={(e) => updateStudentProfile('username', e.target.value)} required></textarea>
                  </div> */}
                </div>
                <div className="form-group-single">
                  <label htmlFor="firstName" >First Name</label>
                  <input type="text" name="firstName" value={student.firstName} onChange={(e) => updateStudentProfile('firstName', e.target.value)}/>
                </div>
                <div className="form-group-single">
                  <label htmlFor="lastName" >Last Name</label>
                  <input type="text" name="lastName" value={student.lastName} onChange={(e) => updateStudentProfile('lastName', e.target.value)}/>
                </div>
                <div className="form-group-single">
                  <label htmlFor="email" >Email</label>
                  <input type="text" name="email" value={student.email} onChange={(e) => updateStudentProfile('email', e.target.value)}/>
                </div>
                <div className="form-group-single">
                  <label htmlFor="linkedin" >LinkedIn</label>
                  <input type="text" name="username" value={student.linkedIn} onChange={(e) => updateStudentProfile('linkedIn', e.target.value)}/>
                </div>
                <div className="form-group-single">
                  <label htmlFor="tags">Research Interests (Press enter to add)</label>
                  <input type="hidden" id="database" data-json={JSON.stringify(userInfo.researchInterests)}></input>
                  <input type="hidden" name="tags" id="tagValue"></input>
                  <div className="form-tag-container">
                    <input type="text" id="researchInterests" name="tags" value={tags} onKeyPress={(e) => handleKeyPress(e)} onChange={(e) => setTags(e.target.value)}/>
                  </div>
                </div>
                <div className="form-group-single">
                  <label htmlFor="institution" >Institution</label>
                  <input type="text" name="institution" value={student.institution} onChange={(e) => updateStudentProfile('institution', e.target.value)}/>
                </div>
                <div className="form-group-single">
                  <label htmlFor="department" >Department</label>
                  <input type="text" name="department" value={student.department} onChange={(e) => updateStudentProfile('department', e.target.value)}/>
                </div>
                <div className="form-group-single">
                  <label htmlFor="areaOfStudy" >Area of Study</label>
                  <input type="text" name="areaOfStudy" value={student.areaOfStudy} onChange={(e) => updateStudentProfile('areaOfStudy', e.target.value)}/>
                </div>
                <div className="form-group-single">
                  <label htmlFor="activity" >Activity</label>
                  <input type="text" name="activity" value={student.activity} onChange={(e) => updateStudentProfile('activity', e.target.value)}/>
                </div>
                <div className="form-group-single">
                    <label htmlFor="biography">Biography</label>
                    <ReactQuill
                        placeholder="Write something..."
                        className="form-group-quill"
                        theme="snow"
                        name="biography"
                        onChange={(e) => updateStudentProfile(e, 'biography')}
                        value={student.biography}
                        modules={modules}
                        formats={formats}
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
                        onChange={(e) => updateStudentProfile(e, 'education')}
                        value={student.education}
                        modules={modules}
                        formats={formats}
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
                        onChange={(e) => updateStudentProfile(e, 'research')}
                        value={student.research}
                        modules={modules}
                        formats={formats}
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
                        onChange={(e) => updateStudentProfile(e, 'publication')}
                        value={student.publication}
                        modules={modules}
                        formats={formats}
                        required
                    />
                </div>
                <div className="form-group-single">
                  {loading == 'user_photo' ? null :  <button className="submit-item">{loading == '' && <span onClick={() => submitStudentProfile()}>Update Profile</span>}{loading == 'user_profile' && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                </div>
              </form>
              {message ? <div className="form-error-message">{message}</div> : null}
            </div>
          </div>
        </div>
      }
      {modal == 'change_password' &&
        <div className="accountUpdateProfile-modal">
          <div className="accountUpdateProfile-modal-box">
            <div className="accountUpdateProfile-modal-box-header">
              <div className="accountUpdateProfile-modal-form-title">Change Password</div>
              <div onClick={() => (setModal(''), setError(''), setMessage(''))}><SVG svg={'close'}></SVG></div>
            </div>
            <form action="" className="accountUpdateProfile-modal-box-form" onSubmit={(e) => sendResetPasswordLink(e)}>
              <div className="form-group-single">
                <label htmlFor="email">Email Linked to Account</label>
                <input type="text" name="email" value={student.email} onChange={(e) => updateStudentProfile('email', e.target.value)} readOnly required/>
              </div>
              <button type="submit" className="submit-item">{loading == '' && <span>Change Password</span>} {loading == 'password' && <div className="loading"><span></span><span></span><span></span></div>}</button>
              {error && <span className="form-errorMessage">{error}</span>}
              {message && <span className="form-successMessage">{message}</span>}
            </form>
          </div>
        </div>
      }
      <Footer navMenu={navMenu}></Footer>
    </>
  )
}

const mapStateToProps = state => {
  return {
    student: state.editRow
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateStudentProfile: (name, value) => dispatch({type: 'EDIT_STATE_STUDENT', payload: {name: name, value: value}}),
    updateInterests: (value) => dispatch({type: 'EDIT_RESEARCH_INTERESTS', payload: value}),
    resetState: () => dispatch({type: 'RESET_STATE'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStudent(Dashboard))
