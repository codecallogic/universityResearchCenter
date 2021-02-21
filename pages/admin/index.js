import React, {useState, useEffect} from 'react'
import withAdmin from '../withAdmin'
import {useRouter} from 'next/router'

// TODO: Create front end protected url routes using SSR

const Dashboard = ({loggedIn, message}) => {
  
  const router = useRouter()
  
  useEffect( () => {
    if(!loggedIn) router.push('/admin/login')
  }, [loggedIn])
  
  return (
    <div>
      Hello
    </div>
  )
}

export default withAdmin(Dashboard)
