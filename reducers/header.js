const initialState = {
  headline: '',
  subheading: '',
  button: '',
  buttonLink: '',
  imageLeftColumn: '',
  imageRightColumn: '',
  captionOne: '',
  captionTwo: '',
}

export const headerReducer = (state = initialState, action)  => {
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