
import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})
import 'react-quill/dist/quill.snow.css'

const Administrators = ({viewAll, errorMessage, successMessage, administrator, createAdministrator}) => {

  const submitAdministrator = () => {

  }
  
  return (
    <div className="dashboard-right-panel">
      <div className="dashboard-right-panel-toggle">View All Adminstrators</div>
      <form className="form" action="POST" onSubmit={(e) => createAdministrator(e)}>
        <div className="form-group-single">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" value={administrator.username} onChange={(e) => createAdministrator('username', e.target.value)} required/>
        </div>
        <button className="submit-item">Create Administrator</button>
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
    createAdministrator: (name, value) => dispatch({type: 'CREATE_ADMIN', name: name, value: value})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Administrators)
