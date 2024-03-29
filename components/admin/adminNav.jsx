import React, {useState, useEffect, useRef} from 'react'
import {useRouter} from 'next/router'
import {API} from '../../config'
import axios from 'axios'

const adminNav = ({data}) => {
  const router = useRouter()
  
  const handleNav = (e) => {
    e.target.textContent.toLowerCase() == 'admin panel' ? window.location.href = '/admin' : null
  } 

  const logout = async (e) => {
    try {
      const response = await axios.post(`${API}/admin/logout`)
      window.location.href = '/admin/login'
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="adminNav-container">
      <nav className="adminNav">
        <div className="nav-logo" onClick={handleNav}>Admin Panel</div>
        <div className="nav-logo-mobile nav-logo-mobile-admin" onClick={handleNav}>Admin Panel</div>
        <div className="nav-admin-menu">
          <a className="nav-admin-menu-item">{data !== undefined ? 
          <span>Hello, {data.username}</span>
          :
          <span>Login first</span>
          }
            <ul className="admin-nav-menu-dropdown">
              <li onClick={() => window.location.href = "/"}>Home</li>
              <li onClick={() => window.location.href = "/admin/account"}>Account</li>
              <li onClick={logout}>Logout</li>
            </ul>
          </a>
        </div>
      </nav>
    </div>
  )
}

export default adminNav
