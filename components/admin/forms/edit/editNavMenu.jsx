import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {API} from '../../../../config'
import axios from 'axios'
import SVGs from '../../../../files/svg'

const NavigationItemForm = ({navitem, editNavItem, setcontent, nav, editMenuItem, resetEditMenu, navItems}) => {
  // console.log(navItems)
  // console.log(navitem)
  const myRefs = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [typeField, setTypeField] = useState('')
  const [input_dropdown, setInputDropdown] = useState('')

  useEffect(() => {
    navitem.item.length > 0 ?
    setTypeField('dropdown')
    :
    setTypeField('input')
  }, [])

  const handleClickOutside = (event) => {
    if(myRefs.current){
      if(!myRefs.current.contains(event.target)){
        setInputDropdown('')
      }
    }
  }

  useEffect(() => {
    // console.log(nav.updated_items)
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [])

  const updateNavMenu = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updateNavMenuResponse = await axios.post(`${API}/menu/update-nav-menu`, nav)
      setLoading(false)
      setMessage('')
      setError('')
      setMessage('Nav menu updated')
      setcontent(updateNavMenuResponse.data)
    } catch (error) {
      console.log(error)
      setMessage('')
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error occurred updating nav item')
    }
  }

  return (
    <>
    <form className="form editing" onSubmit={(e) => updateNavMenu(e)}>
      <div className="form-group-single">
        <label htmlFor="name">Name Menu</label>
        <input type="text" name="name" value={navitem.name} onChange={(e) => editNavItem('name', e.target.value)} required/>
      </div>
      <div className="form-group-single">
        <label htmlFor="type" className="form-group-single-label-toggle">Type 
          {typeField == 'dropdown' && <div className="form-group-single-toggle" onClick={() => (setTypeField('input'), resetEditMenu())}>Link</div>}
          {typeField == 'input' && <div className="form-group-single-toggle" onClick={() => (setTypeField('dropdown'), editNavItem('link', ''))}>Nav Item</div>}
        </label>
        {typeField == 'input' && 
          <input type="text" name="heading" value={navitem.link} onChange={(e) => editNavItem('link', e.target.value)} placeholder="Paste link"/>
        }
        {typeField == 'dropdown' && 
          <div className="form-group-single-dropdown-input">
          <textarea id="menu_item" rows="2" name="menu_item" placeholder="(Select Menu Item)" onClick={() => setInputDropdown('menu_item')} readOnly></textarea>
          {input_dropdown == '' && <span onClick={() => setInputDropdown('menu_item')}><SVGs svg={'arrow-down'}></SVGs></span>}
          {input_dropdown == 'menu_item' && <span onClick={() => (setInputDropdown(''))}><SVGs svg={'arrow-up'}></SVGs></span>}
          {input_dropdown == 'menu_item' && <div className="form-group-single-dropdown-input-list" ref={myRefs}>
            {navItems.length > 0 && navItems.map((item, idx) => 
              <div key={idx} className="form-group-single-dropdown-input-list-item" onClick={() => (editMenuItem(item), setInputDropdown(''))}>{item.name} {nav.item.some((list) => list._id == item._id) ? <SVGs svg={'checkmark'}></SVGs> : ''}</div>
            )}
          </div>
          }
          </div>
        }
      </div>

      <button className="submit-item">{!loading && <span>Update Nav Menu</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
    </form>
    {error && <div className="form-errorMessage">{error}</div>}
    {message && <div className="form-successMessage">{message}</div>}
    </>
  )
}

const mapStateToProps = state => {
  return {
    nav: state.editRow
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editNavItem: (name, value) => dispatch({type: 'EDIT_STATE_NAVITEM', name: name, value: value}),
    resetEditMenu: () => dispatch({type: 'RESET_EDIT_MENU'}),
    editMenuItem: (item) => dispatch({type: 'EDIT_MENU_ITEM', value: item}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationItemForm)
