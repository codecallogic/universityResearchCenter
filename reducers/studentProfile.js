const initialState = {
  file: '',
  firstName: 'a',
  lastName: 'a',
  linkedIn: 'a',
  researchInterests: '',
  institution: 'a',
  department: 'a',
  areaOfStudy: 'a',
  email: 'j.fabricio.au@gmail.com',
  activity: 'a',
  biography: 'a',
  education: 'a',
  research: 'a',
  publication: 'a',
  username: 'abc',
  password: ''
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