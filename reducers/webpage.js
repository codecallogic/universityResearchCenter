const initialState = {
  heading: '',
  content: ''
}

export const webpageReducer = (state = initialState, action)  => {
  switch (action.type) {
    case 'RESET_STATE':
    return initialState
    
    case 'UPDATE_STATE_WEBPAGE':
      return {
        ...state,
        [action.name]: action.payload
      }
      break;
      
    default:
      return state
  }
}