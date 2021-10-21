import cookie from 'js-cookie'

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
  
  // let tokenValue = token.split(';')[0]

  const array = new Array(token.split(';'))

  const newArray = array[0].map( (i) => {
    return i.trim()
  })

  let el = newArray.find( a => a.includes("accessToken"))

  return el
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
  
  // let userData = user.split(';')[1]

  const array = new Array(user.split(';'))

  const newArray = array[0].map( (i) => {
    return i.trim()
  })

  let el = newArray.find( a => a.includes("user"))

  return el
}

// GET STUDENT TOKEN
export const getStudentToken = (key, req) => {
  return process.browser ? getStudentCookieFromBrowser(key) : getStudentCookieFromServer(key, req)
}

export const getStudentCookieFromBrowser = (key) => {
  return cookie.get(key)
}

export const getStudentCookieFromServer = (key, req) => {
  if(!req.headers.cookie){
      return undefined
  }
  
  let token = req.headers.cookie

  if(!token){
      return undefined
  }
  
  // let tokenValue = token.split(';')[0]

  const array = new Array(token.split(';'))

  const newArray = array[0].map( (i) => {
    return i.trim()
  })

  let el = newArray.find( a => a.includes("studentAccessToken"))

  return el
}

// Get user
export const getStudentUser = (key, req) => {
  return process.browser ? getUserFromBrowser(key) : getUserFromServer(key, req)
}

export const getStudentUserFromBrowser = (key) => {
  return cookie.get(key)
}

export const getStudentUserFromServer = (key, req) => {
  if(!req.headers.cookie){
      return undefined
  }

  let user = req.headers.cookie

  if(!user){
      return undefined
  }
  
  // let userData = user.split(';')[1]

  const array = new Array(user.split(';'))

  const newArray = array[0].map( (i) => {
    return i.trim()
  })

  let el = newArray.find( a => a.includes("student"))

  return el
}