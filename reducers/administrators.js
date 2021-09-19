const initialState = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  urlID: '',
  tempPassword: '',
}

export const administratorReducer = (state = initialState, action) =>  {
  switch (action.type) {
    case 'RESET_STATE':
      return initialState

    case 'CREATE_ADMIN':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
      
    default:
      return state
  }
}