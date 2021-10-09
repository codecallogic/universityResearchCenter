import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {API} from '../../../config'
import axios from 'axios'
import SVGs from '../../../files/svg'

const NavigationForm = ({errorMessage, successMessage, nav, createNavMenu, resetNavigation, resetNavItems, navItems, createNavMenuItem}) => {
  // console.log(navItems)
  const myRefs = useRef(null)
  const [typeField, setTypeField] = useState('input')
  const [input_dropdown, setInputDropdown] = useState('')
  const [loading, setLoading] = useState(false)

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
          {typeField == 'input' && <div className="form-group-single-toggle" onClick={() => (setTypeField('dropdown'), resetNavItems())}>Nav Item</div>}
        </label>
        {typeField == 'input' &&
          <input type="text" name="heading" value={nav.link} onChange={(e) => createNavMenu('link', e.target.value)} placeholder="Paste link"/>
        }
        {typeField == 'dropdown' && <>
          <div className="form-group-single-dropdown-input">
            <textarea id="menu_item" rows="2" name="menu_item" placeholder="(Select Menu Item)" onClick={() => setInputDropdown('menu_item')} readOnly></textarea>
            {input_dropdown == '' && <span onClick={() => setInputDropdown('menu_item')} value={nav.item}><SVGs svg={'arrow-down'}></SVGs></span>}
            {input_dropdown == 'menu_item' && <span onClick={() => (setInputDropdown(''))} value={nav.item}><SVGs svg={'arrow-up'}></SVGs></span>}
            {input_dropdown == 'menu_item' && <div className="form-group-single-dropdown-input-list" ref={myRefs}>
              {navItems.length > 0 && navItems.map((item, idx) => 
                <div key={idx} className="form-group-single-dropdown-input-list-item" onClick={() => (createNavMenuItem(item._id), setInputDropdown(''))}>{item.name} {nav.item.some((list) => list == item._id) ? <SVGs svg={'checkmark'}></SVGs> : ''}</div>
              )}
            </div>
            }
          </div>
          {navItems.map((item, idx) => 
            nav.item.map((id) => 
              id == item._id ? <a href={`${item.link}`} target="_blank" className="form-group-single-dropdown-selected" key={idx}>{item.name}</a> : null
            )
          )}
          </>
        }
      </div>
      <button className="submit-item">{!loading && <span>Create Nav Menu</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
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
    createNavMenuItem: (id) => dispatch({type: 'ADD_NAV_ITEM', value: id}),
    resetNavigation: () => dispatch({type: 'RESET_STATE'}),
    resetNavItems: () => dispatch({type: 'RESET_NAV_ITEMS'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationForm)
