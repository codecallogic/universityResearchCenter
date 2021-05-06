import React, {useState, useEffect} from 'react'
import Nav from '../components/nav'
import axios from 'axios'
import {API, PUBLIC_FILES} from '../config'

const FileUpload = ({}) => {

  const [image, setImage] = useState('')
  const [url, setURL] = useState('')

  const uploadImage = async (e) => {
    e.preventDefault()
    let data = new FormData()
    data.append('file', image)

    try {
      const responseUpload = await axios.post(`${API}/upload`, data, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
      setURL(responseUpload.data.filename)
      console.log(responseUpload)
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div>
      <Nav></Nav>
      <div className="center">
        <form className="form" onSubmit={uploadImage}>
          <div className="form-group-single">
            <label htmlFor="image">Image URL</label>
            <input type="file" className="form-group-file" onChange={(e) => setImage(e.target.files[0])}/>
          </div>
          <button type="submit" className="submit-item">Upload</button>
        </form>
      </div>
      {url ? <img className="public-image" src={`${PUBLIC_FILES}/${url}`} alt=""/> : null }
    </div>
  )
}

export default FileUpload
