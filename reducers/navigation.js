const initialState = {
  name: '',
  link: '',
  item: []
}

export const navigationReducer = (state = initialState, action) =>  {
  switch (action.type) {
    case 'RESET_STATE':
      return initialState

    case 'CREATE_NAV_MENU':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
      
    default:
      return state
  }
}