export const parseCreatedAtDates = (data) => {
  let newResultsCreatedAtDates = data.map( item => {
    let now = new Date(item.createdAt)
    item.createdAt = now.toISOString().slice(0,10)
    return item
  })
}

export const parseExpirationDates = (data) => {
  let newResultsExpirationDates = data.map( item => {
    if(item.expiration !== null){
      console.log(item)
      let now = new Date(item.expiration)
      item.expiration = now.toISOString().slice(0,10)
      return item
    }
    if(item.expiration === null){
      item.expiration = 'no expiration'
      return item
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