import cookie from 'js-cookie'
import Router from 'next/router';

// Get token
export const getToken = (key, req) => {
  return process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req)
}

export const getCookieFromBrowser = (key) => {
  return cookie.get(key)
}

export const getCookieFromServer = (key, req) => {
  if(!req.headers.cookie){
      return undefined
  }

  let token = req.headers.cookie

  if(!token){
      return undefined
  }
  
  let tokenValue = token.split(';')[0]
  return tokenValue
}

// Get user
export const getUser = (key, req) => {
  return process.browser ? getUserFromBrowser(key) : getUserFromServer(key, req)
}

export const getUserFromBrowser = (key) => {
  return cookie.get(key)
}

export const getUserFromServer = (key, req) => {
  if(!req.headers.cookie){
      return undefined
  }

  let user = req.headers.cookie

  if(!user){
      return undefined
  }
  
  let userData = user.split(';')[1]
  return userData
}