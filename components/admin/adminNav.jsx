import React, {useState, useEffect, useRef} from 'react'
import {useRouter} from 'next/router'

const adminNav = ({data}) => {

  const router = useRouter()
  
  const handleNav = (e) => {
    e.target.textContent.toLowerCase() == 'admin' ? window.location.href = '/admin/login' : null
  } 
  
  return (
    <div className="adminNav-container">
      <nav className="adminNav">
        <div className="nav-logo">Admin Panel</div>
        <div className="nav-menu">
          <a className="nav-menu-item">{data !== undefined ? 
          <span>Hello, {data.username}</span>
          :
          <span>Login first</span>
          }
            <ul className="nav-menu-dropdown">
              <li onClick={handleNav}>Logout</li>
            </ul>
          </a>
        </div>
      </nav>
    </div>
  )
}

export default adminNav
