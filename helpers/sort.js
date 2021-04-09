export const parseCreatedAtDates = (data) => {
  let newResultsCreatedAtDates = data.map( item => {
    let now = new Date(item.createdAt)
    item.createdAt = now.toISOString().slice(0,10)
    return item
  })
}

export const parseUpdatedAtDates = (data) => {
  let newResultsUpdatedAtDates = data.map( item => {
    let now = new Date(item.updatedAt)
    item.updatedAt = now.toISOString().slice(0,10)
    return item
  })
}

export const parseExpirationDates = (data, current) => {
  let newResultsExpirationDates = data.map( item => {
    if(item.expiration !== undefined){
      if(item.expiration == '1970-01-01'){
        item.expiration = 'no expiration'
        return item
      }

      if(item.expiration === null){
        item.expiration = 'no expiration'
        return item
      }

      if(item.expiration !== 'no expiration'){
        let now = new Date(item.expiration)
        item.expiration = now.toISOString().slice(0,10)
        return item
      }
    }
  })
}

export const sortByCreationDate = (data) => {
  let newArray = []
  let filterDates = data.sort( (a, b) => {
    return (new Date(b.createdAt) - new Date(a.createdAt)) > -1 ? -1 : 1;
  })
  newArray = [...filterDates]
  return newArray
}

export const sortByExpirationDate = (data) => {
  let newArray = []
  let filterDates = data.sort( (a, b) => {
    return (new Date(b.expiration) - new Date(a.expiration)) > -1 ? -1 : 1;
  })
  newArray = [...filterDates]
  return newArray
}

export const removeHeadersSliderComponent = (data) => {
  data.forEach( (item, index) => {
    delete item.updatedAt
  })
}

export const removeHeadersStudentProfile = (data) => {
  data.forEach( (item, index) => {
    delete item.updatedAt
    delete item.biography
    delete item.education
    delete item.research
    delete item.publication
    delete item.researchInterests
    delete item.photo
    delete item.email
  })
}

export const setDropDowns = (value, i) => {
  const boxes = document.querySelectorAll('.form-selection-boxes')
  boxes[0].selectedIndex = 0
  const components = document.querySelectorAll('.form-selection-components')
  components[0].selectedIndex = 0
  const profiles = document.querySelectorAll('.form-selection-profiles')
  profiles[0].selectedIndex = 0
  
  if(i){
    const el = document.querySelectorAll(`.form-selection-${value}`)
    el[0].selectedIndex = i
  }
}

export const sortByEnableAndCreationDate = (data) => {

  let newArray = []

  let filteredByCreatedDate = data.sort( (a, b) => {
    return (new Date(b.createdAt) - new Date(a.createdAt)) > -1 ? 1 : -1;
  })

  newArray = [...filteredByCreatedDate]
  
  let filterArray = newArray.slice(0, 5)
  
  let filter = filterArray.filter( (item) => {
    if(item.enabled === true){
      return item
    }
  })

  return filter
}

export const rightColumnImages = (data) => {

  let filter = data.map( (item) => {
    if(item.imageRightColumn){
      return item.imageRightColumn
    }
  })

  return filter
}

export const selectOne = (students) => {
  let enabledStudents = students.filter( (person) => {
    if(person.enabled == true){
      return person
    }
  })

  let randomIndex = Math.floor(Math.random() * enabledStudents.length)

  let selectedStudent = new Array(enabledStudents[randomIndex])

  return selectedStudent
}

export const generateURL = (data) => {
  let newArray = data.filter( (item) => {
    return item.url = `/${item.heading}/${(item._id)}`
  })

 return newArray
}