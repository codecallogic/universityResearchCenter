const initialState = {
  headline: 'adfa',
  subheading: 'asdfsa',
  button: 'asdfas',
  buttonLink: 'asdfas',
  captionOne: '1',
  captionTwo: '2',
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