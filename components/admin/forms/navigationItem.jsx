import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {API} from '../../../config'
import axios from 'axios'
import SVGs from '../../../files/svg'

const NavigationItemForm = ({errorMessage, successMessage, setsuccessmessage, seterrormessage, nav, setallnavitems, createNavMenu, resetNavigation}) => {
  const myRefs = useRef(null)
  const [typeField, setTypeField] = useState('input')
  const [input_dropdown, setInputDropdown] = useState('')
  const [loading, setLoading] = useState(false)

  const createNavItem = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseNav = await axios.post(`${API}/menu/create-nav-item`, nav)
      setLoading(false)
      resetNavigation()
      seterrormessage('')
      setallnavitems(responseNav.data)
      setsuccessmessage(`Created nav item`)
    } catch (error) {
      console.log(error)
      setsuccessmessage('')
      setLoading(false)
      if(error) return error.response ? seterrormessage(error.response.data) : seterrormessage('Could not save item, please try again later')
    }
  }
  
  return (
    <div className="dashboard-right-panel">
    <div className="dashboard-right-panel-toggle" onClick={() => window.location.href = `/admin/view/nav-items`}>View Navigation Items</div>
    <form className="form" onSubmit={(e) => createNavItem(e)}>
      <div className="form-group-single">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={nav.name} onChange={(e) => createNavMenu('name', e.target.value)} required/>
      </div>
      <div className="form-group-single">
        <label htmlFor="type" className="form-group-single-label-toggle">Link</label>
        {typeField == 'input' &&
          <input type="text" name="heading" value={nav.link} onChange={(e) => createNavMenu('link', e.target.value)} placeholder="Paste link"/>
        }
      </div>
      <button className="submit-item">{!loading && <span>Create Nav Item</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
      </form>
      {errorMessage && <div className="form-errorMessage">{errorMessage}</div>}
      {successMessage && <div className="form-successMessage">{successMessage}</div>}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    nav: state.navigation
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createNavMenu: (name, value) => dispatch({type: 'CREATE_NAV_MENU', name: name, value: value}),
    resetNavigation: () => dispatch({type: 'RESET_NAV'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationItemForm)
