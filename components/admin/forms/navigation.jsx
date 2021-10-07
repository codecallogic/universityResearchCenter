import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {API} from '../../../config'
import axios from 'axios'
import SVGs from '../../../files/svg'

const NavigationForm = ({errorMessage, successMessage, nav, createNavMenu, resetNavigation}) => {
  const myRefs = useRef(null)
  const [typeField, setTypeField] = useState('input')
  const [input_dropdown, setInputDropdown] = useState('')

  const handleClickOutside = (event) => {
    if(myRefs.current){
      if(!myRefs.current.contains(event.target)){
        setInputDropdown('')
      }
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [])
  
  return (
    <div className="dashboard-right-panel">
    <div className="dashboard-right-panel-toggle" onClick={() => viewAll()}>View Navigation Items</div>
    <form className="form" action="POST" onSubmit={(e) => createWebpage(e)}>
      <div className="form-group-single">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={nav.name} onChange={(e) => createNavMenu('name', e.target.value)} required/>
      </div>
      <div className="form-group-single">
        <label htmlFor="type" className="form-group-single-label-toggle">Type 
          {typeField == 'dropdown' && <div className="form-group-single-toggle" onClick={() => setTypeField('input')}>Link</div>}
          {typeField == 'input' && <div className="form-group-single-toggle" onClick={() => setTypeField('dropdown')}>Item</div>}
        </label>
        {typeField == 'input' &&
          <input type="text" name="heading" value={nav.link} onChange={(e) => createNavMenu('link', e.target.value)} placeholder="Paste link"/>
        }
        {typeField == 'dropdown' && <>
          <div className="form-group-single-dropdown-input" onClick={() => setInputDropdown('menu_item')} value={nav.item} >
            <textarea id="menu_item" rows="2" name="menu_item" placeholder="(Select Menu Item)" readOnly></textarea>
            <SVGs svg={'arrow-down'}></SVGs>
            {input_dropdown == 'menu_item' && <div className="form-group-single-dropdown-input-list" ref={myRefs}>
              <div className="form-group-single-dropdown-input-list-item">Item One</div>
            </div>
            }
          </div>
          </>
        }
      </div>
      <button className="submit-item">Create Webpage</button>
      </form>
      {errorMessage !== null && <div className="form-errorMessage">{errorMessage}</div>}
      {successMessage !== null && <div className="form-successMessage">{successMessage}</div>}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    nav: state.administrator
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createNavMenu: (name, value) => dispatch({type: 'CREATE_NAV_MENU', name: name, value: value}),
    resetNavigation: () => dispatch({type: 'RESET_STATE'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationForm)
