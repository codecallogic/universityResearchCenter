import React, {useState, useEffect, useRef} from 'react'
import {useRouter} from 'next/router'

const Nav = ({}) => {
  const router = useRouter()
  
  const handleNav = (e) => {
    e.target.textContent.toLowerCase() == 'admin' ? window.open('/admin', '_blank', 'noopener,noreferrer') : null
  } 
  
  return (
    <>
    <div className="nav-container">
      <nav className="nav">
        <a href="/" className="nav-logo">Student Research Center</a>
        <div className="nav-menu">
          <a className="nav-menu-item">About
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
          </a>
          <div className="form-group">
            <input className="nav-menu-item-search" type="text" name="search" placeholder="Search"/>
            <svg>
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
