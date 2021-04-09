import React, {useState, useEffect} from 'react'
import Nav from '../../components/nav'
import axios from 'axios'
import {API} from '../../config'

const Webpage = ({webpage}) => {
  
  return (
    <>
      <Nav></Nav>
      <div className="webpage-container">
        <div className="webpage" dangerouslySetInnerHTML={ { __html: webpage ? webpage.content : null } }></div>
      </div>
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

  return {
    webpage: webpage ? webpage.data : null
  }
}

export default Webpage
