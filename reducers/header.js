const initialState = {
  headline: '',
  subheading: '',
  button: '',
  buttonLink: '',
  captionOne: '',
  captionTwo: '',
  imageLeftColumn: '',
  imageRightColumn: ''
}

export const headerReducer = (state = initialState, action)  => {
  // if(action.payload) console.log(action.payload.value)
  switch (action.type) {
    case 'RESET_STATE':
    return initialState
    
    case 'UPDATE_STATE_HEADER':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
      break;
      
    default:
      return state
  }
}