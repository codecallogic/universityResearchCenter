const initialState = {
  file: '',
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
  content: '',
  name: '',
  link: '',
  item: [],
}

export const editRow = (state = initialState, action)  => { 
  // if(action.payload) console.log(action.payload.name)
  switch (action.type) {
    case 'RESET_STATE':
    return initialState

    case 'RESET_STATE_EDIT':
    return initialState

    case 'SET_EDIT_STUDENT':
      if(action.payload.content._id == action.payload.selected){
        return action.payload.content
      }
      break;

    case 'EDIT_NAVITEM':
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
      // console.log(action.payload)
      const newArray = [...state.tagsToRemove]
      // console.log(newArray.indexOf(action.payload))
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

    case 'EDIT_STATE_NAVITEM':
      return {
        ...state,
        [action.name]: action.value
      }
      break;

    case 'EDIT_MENU_ITEM':
      // console.log(state.item)
      // console.log(action.value)
      if(state.item.some((item) => item._id == action.value._id)){
        let array = []
        
        state.item.filter((listItem) => {
          if(listItem._id !== action.value._id) array.push(listItem)
        })

        return {
          ...state,
          item: array
        }
      }

      return {
        ...state,
        item: [...state.item, action.value]
      }
      break;

    case 'RESET_EDIT_MENU':
      return {
        ...state,
        item: []
      }

      
    default:
      return state
  }
}