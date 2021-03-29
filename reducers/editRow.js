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
}

export const editRow = (state = initialState, action)  => {  
  switch (action.type) {
    case 'RESET_STATE':
    return initialState

    case 'SET_EDIT_STUDENT':
      for(let i = 0; i < action.payload.content.length; i++){
        if(action.payload.content[i]._id == action.payload.selected){
          return action.payload.content[i]
        }
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