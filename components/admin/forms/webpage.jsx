import {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'

const Webpage = ({createWebpage, handleWebpage, errorMessage, successMessage, webpage}) => {

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
  
  return (
    <div className="dashboard-right-panel">
    <div className="dashboard-right-panel-toggle" onClick={() => viewAll()}>View All Webpages</div>
    <form className="form" action="POST" onSubmit={(e) => createWebpage(e)}>
      <div className="form-group-single">
        <label htmlFor="heading">Heading</label>
        <input type="text" name="heading" value={webpage.heading} onChange={(e) => handleWebpage(e, 'heading')} required/>
      </div>
      <div className="form-group-single">
          <label htmlFor="content">Content</label>
          <ReactQuill
              placeholder="Write something..."
              className="form-group-quill"
              theme="snow"
              name="content"
              onChange={(e) => handleWebpage(e, 'content')}
              value={webpage.content}
              required
          />
      </div>
      <button className="submit-item">Create Webpage</button>
      </form>
      {errorMessage !== null && <div className="form-errorMessage">{errorMessage}</div>}
      {successMessage !== null && <div className="form-successMessage">{successMessage}</div>}
    </div>
  )
}

export default Webpage
