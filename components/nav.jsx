import React, {useState, useEffect, useRef} from 'react'
import {useRouter} from 'next/router'

const Nav = ({}) => {
  const router = useRouter()

  const [search, setSearch] = useState('')
  
  const handleNav = (e) => {
    e.target.textContent.toLowerCase() == 'admin' ? window.open('/admin', '_blank', 'noopener,noreferrer') : null
  }

  const goToPage = (var1) => {
    window.open(`/${var1}`, '_blank', 'noopener,noreferrer')
  }

  const searchGoogle = (e) => {
    if(e.key == 'Enter') window.open(`https://www.google.com/search?q=${e.target.value}&as_rq=http://csms.calstatela.edu/`, '_blank')
    if(e == 'icon') window.open(`https://www.google.com/search?q=${search}&aas_rq=http://csms.calstatela.edu/`, '_blank')
  }
  
  return (
    <>
    <div className="nav-container">
      <nav className="nav">
        <img src="/media/logo-colorido.png" className="nav-logo"/>
        <div className="nav-menu">
          {/* <a className="nav-menu-item">About
            <ul className="nav-menu-dropdown">
              <li>About Item 1</li>
              <li>About Item 2</li>
              <li>About Item 3</li>
            </ul>
          </a>
          <a className="nav-menu-item">Research
            <ul className="nav-menu-dropdown">
              <li>Research Item 1</li>
              <li>Research Item 2</li>
              <li>Research Item 3</li>
            </ul>
          </a>
          <a className="nav-menu-item">Education
            <ul className="nav-menu-dropdown">
              <li>Education Item 1</li>
              <li>Education Item 2</li>
              <li>Education Item 3</li>
            </ul>
          </a>
          <a className="nav-menu-item">Resources
            <ul className="nav-menu-dropdown">
              <li>Resources Item 1</li>
              <li>Resources Item 2</li>
              <li>Resources Item 3</li>
            </ul>
          </a>
          <a className="nav-menu-item">Accounts
            <ul className="nav-menu-dropdown">
              <li onClick={handleNav}>Admin</li>
              <li>Student</li>
              <li>Researcher</li>
            </ul>
          </a> */}
          <div className="form-group-search">
            <input type="text" name="search" placeholder="Search" onKeyDown={(e) => searchGoogle(e)} onChange={(e) => setSearch(e.target.value)} value={search}/>
            <svg name="icon" onClick={() => searchGoogle('icon')}>
              <use xlinkHref="sprite.svg#icon-search"></use>
            </svg>
          </div>
        </div>
      </nav>
    </div>
    </>
  )
}

export default Nav
