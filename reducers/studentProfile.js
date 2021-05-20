const initialState = {
  file: '',
  firstName: 'asdf',
  lastName: 'asfa',
  linkedIn: 'asfda',
  researchInterests: '',
  institution: 'asdfa',
  department: 'asfa',
  areaOfStudy: 'asdfas',
  email: 'asdfas@gmail.com',
  activity: 'asdfa',
  biography: 'asdfa',
  education: 'asdfa',
  research: 'asdfas',
  publication: 'asdfas',
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