import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {API} from '../../../../config'
import axios from 'axios'
import SVGs from '../../../../files/svg'

const NavigationItemForm = ({navitem, editNavItem, setcontent}) => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const updateNavItem = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updateNavItemResponse = await axios.post(`${API}/menu/update-nav-item`, navitem)
      setLoading(false)
      setMessage('')
      setError('')
      setMessage('Nav item updated')
      setcontent(updateNavItemResponse.data)
    } catch (error) {
      console.log(error)
      setMessage('')
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error occurred updating nav item')
    }
  }

  return (
    <>
    <form className="form editing" onSubmit={(e) => updateNavItem(e)}>
      <div className="form-group-single">
        <label htmlFor="name">Name Item</label>
        <input type="text" name="name" value={navitem.name} onChange={(e) => editNavItem('name', e.target.value)} required/>
      </div>
      <div className="form-group-single">
        <label htmlFor="type" className="form-group-single-label-toggle">Link</label>
        <input type="text" name="heading" value={navitem.link} onChange={(e) => editNavItem('link', e.target.value)} placeholder="Paste link"/>
      </div>
      <button className="submit-item">{!loading && <span>Update Nav Item</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
    </form>
    {error && <div className="form-errorMessage">{error}</div>}
    {message && <div className="form-successMessage">{message}</div>}
    </>
  )
}

const mapStateToProps = state => {
  return {
    nav: state.navigation
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editNavItem: (name, value) => dispatch({type: 'EDIT_STATE_NAVITEM', name: name, value: value}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationItemForm)
