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
  heading: '',
  content: ''
}

export const editRow = (state = initialState, action)  => { 
  // if(action.payload) console.log(action.payload.value)
  switch (action.type) {
    case 'RESET_STATE':
    return initialState

    case 'SET_EDIT_STUDENT':
      if(action.payload.content._id == action.payload.selected){
        return action.payload.content
      }
      break;

    case 'SET_EDIT_WEBPAGE':
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

    case 'REMOVE_TAG_FROM_TAGS_TO_REMOVE_ARRAY':
      console.log(action.payload)
      const newArray = [...state.tagsToRemove]
      console.log(newArray.indexOf(action.payload))
      if(newArray.indexOf(action.payload) !== -1){
        newArray.splice(newArray.indexOf(action.payload), 1)
      }
      
      return {
        ...state,
        tagsToRemove: newArray
      }
      break;

    case 'EDIT_STATE_WEBPAGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
      break;

    case 'EDIT_STATE_WEBPAGE_CONTENT':
      return {
        ...state,
        content: action.payload.value
      }
      break;
      
    default:
      return state
  }
}