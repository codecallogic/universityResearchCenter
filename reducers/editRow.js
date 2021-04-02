const initialState = {
  photo: '',
  firstName: '',
  lastName: '',
  linkedIn: '',
  enabled: '',
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
  tagsToRemove: [],
}

export const editRow = (state = initialState, action)  => { 
  switch (action.type) {
    case 'RESET_STATE':
    return initialState

    case 'SET_EDIT_STUDENT':
      if(action.payload.content._id == action.payload.selected){
        return action.payload.content
      }
      break;
    
    case 'EDIT_STATE_STUDENT':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
      break;

    case 'EDIT_RESEARCH_INTERESTS':
      return {
        ...state,
        researchInterests: action.payload
      }
      break;

    case 'RESEARCH_INTERESTS_TO_BE_REMOVED':
      return {
        ...state,
        tagsToRemove: state.tagsToRemove ? state.tagsToRemove.concat(action.payload) : action.payload
      }
      break;

    case 'EDIT_STATE_ENABLED':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
      break;
      
    default:
      return state
  }
}