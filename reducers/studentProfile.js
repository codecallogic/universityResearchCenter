const initialState = {
  file: '',
  firstName: '',
  lastName: '',
  linkedIn: '',
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
    
    case 'UPDATE_STATE_STUDENT':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
      break;

    case 'UPDATE_RESEARCH_INTERESTS':
      return {
        ...state,
        researchInterests: action.payload
      }
      break;
      
    default:
      return state
  }
}