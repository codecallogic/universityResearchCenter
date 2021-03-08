export const sortCreatedAtDates = (data) => {
  let newResultsCreatedAtDates = data.map( item => {
    let now = new Date(item.createdAt)
    item.createdAt = now.toISOString().slice(0,10)
    return item
  })
}

export const sortExpirationDates = (data) => {
  let newResultsExpirationDates = data.map( item => {
    let now = new Date(item.expiration)
    item.expiration = now.toISOString().slice(0,10)
    return item
  })
}