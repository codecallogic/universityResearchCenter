import React, {useState, useEffect} from 'react'
import Nav from '../../components/nav'
import Footer from '../../components/footer'
import axios from 'axios'
import {API} from '../../config'

const Webpage = ({webpage, navMenu}) => {
  
  return (
    <>
      <Nav navMenu={navMenu}></Nav>
      <div className="webpage-container">
        <div className="webpage" dangerouslySetInnerHTML={ { __html: webpage ? webpage.content : null } }></div>
      </div>
      <Footer navMenu={navMenu}></Footer>
    </>
  )
}

Webpage.getInitialProps = async ({query: {id}}) => {
  let webpage 

  try {
    webpage = await axios.get(`${API}/webpage/${id}`)
  } catch (error) {
    console.log('error')
  }

  let navMenusResponse 
  try {
   navMenusResponse = await axios.get(`${API}/menu/get-nav-menus`)
  } catch (error) {
    console.log('error')
  }

  

  return {
    webpage: webpage ? webpage.data : null,
    navMenu: navMenusResponse.data
  }
}

export default Webpage
