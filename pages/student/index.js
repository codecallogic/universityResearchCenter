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
import {useRouter} from 'next/router'

const Dashboard = ({params, authorization, account, userInfo, navMenu, student, updateStudentProfile, updateInterests, resetStudentProfile}) => {
  // console.log(JSON.parse(decodeURIComponent(account)))
  // console.log(userInfo)
  const router = useRouter()
  const [user, setUser] = useState(userInfo)
  const [modal, setModal] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState('')
  const [dash, setDash] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    if(params) params.view ? setDash(params.view) : null
    for(let key in userInfo){
      if(key !== 'password') updateStudentProfile(key, userInfo[key])
    }
  }, [router.query.change])

  useEffect(() => {
    if(student.file)( setLoading('user_photo'), submitStudentProfile())
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

  const submitStudentProfile = async (e) => {
    if(e) e.preventDefault()
    let array = []
    if(student.researchInterests[0]){
      if(student.researchInterests[0]._id){
        student.researchInterests.forEach((item) => {
          if(item.tag) array.push(item.tag)
        })
        student.researchInterests = array
      }
    }
    
    if(student.researchInterests.length > 0){
      let filter = student.researchInterests.filter((item) => {
        if(item) return item
      })
      student.researchInterests = filter
    }

    let data = new FormData()

    student.file ? data.append('file', student.file, student.photo) : null
    for( let key in student){
      if(key !== 'file') data.append(key, student[key])
    }
  
    try {
      const studentUpdateResponse = await axios.post(`${API}/student-update-profile`, data, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          contentType: `multipart/form-data`
        }
      })

      window.location.href = `/student?view=profile`
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error ocurred updating profile.')
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
              <span onClick={() => (setDash(''), setLoading(''))}>Dashboard</span>
              <SVG svg={'keyboard-right'}></SVG> 
              <div>Profile</div>
            </div>
          </div>
          <div className="account-student-title">Profile Info</div>
          <div className="account-student-profile">
          <div className="account-student-profile-left">
            <label htmlFor="file" className="account-student-profile-left-image">
              {loading !== 'user_photo' && userInfo.photo ? userInfo.photo.length > 0 ? <img src={`${PUBLIC_FILES}/${userInfo.photo}`}></img> : null : null}
              {loading == 'user_photo' ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading-profile-image" allowFullScreen></iframe> : userInfo.photo ? userInfo.photo.length < 1 ? <SVG svg={'account-circle'}></SVG> : null : <SVG svg={'account-circle'}></SVG>}
              <a>Update profile photo</a>
            </label>
            <input type="file" name="file" id="file" accept="image/*" onChange={(e) => (updateStudentProfile('file', e.target.files[0]))}/>
          </div>
          <div className="account-student-profile-right">
              <div className="account-student-profile-right-title">Hi, I'm {userInfo ? userInfo.username : 'Unknown'}</div>
              <form className="form" onSubmit={(e) => (submitStudentProfile(e), setLoading('user_profile'))}>
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
                        onChange={(e) => updateStudentProfile('biography', e)}
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
                        onChange={(e) => updateStudentProfile('education', e)}
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
                        onChange={(e) => updateStudentProfile('research', e)}
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
                        onChange={(e) => updateStudentProfile('publication', e)}
                        value={student.publication}
                        modules={modules}
                        formats={formats}
                        required
                    />
                </div>
                <div className="form-group-single">
                  {loading == 'user_photo' ? null :  <button  type="submit" className="submit-item">{loading == '' && <span>Update Profile</span>}{loading == 'user_profile' && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                </div>
              </form>
              {error && <span className="form-errorMessage">{error}</span>}
              {message ? <div className="form-successMessage">{message}</div> : null}
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
    resetStudentProfile: () => dispatch({type: 'RESET_STATE_EDIT'})
  }
}

Dashboard.getInitialProps = ({query}) => {
  return {
    params: query
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStudent(Dashboard))
