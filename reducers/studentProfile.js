const initialState = {
  photo: '',
  name: '',
  linkedin: '',
  researchInterests: '',
  institution: '',
  department: '',
  areaOfStudy: '',
  email: '',
  activity: '',
  biography: '',
  education: '',
  research: '',
  publication: '',
}

export const studentProfileReducer = (state = initialState, action)  => {
  switch (action.type) {
    case 'RESET_STATE':
    return initialState
    
    case 'UPDATE_STATE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
      break;
      
    default:
      return state
  }
}