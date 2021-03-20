const initialState = {
  translate: 0,
  transition: .45,
  activeIndex: 0,
  width: 0
}

export const sliderReducer = (state = initialState, action)  => {
  if(action.type === 'WIDTH') return {...state, width: action.width}
  switch(action.type){
    case "BACK_TO_START":
      return {
        ...state,
        translate: 0,
        activeIndex: 0
      }
 
    case "NEXT_SLIDE":
      return {
        ...state,
        activeIndex: state.activeIndex + 1,
        translate: (state.activeIndex + 1) * state.width
      }
    
    case "LAST_SLIDE":
      return {
        ...state,
        translate: (action.length - 1) * state.width,
        activeIndex: action.length - 1
      }

    case "PREV_SLIDE":
      return {
        ...state,
        activeIndex: state.activeIndex - 1,
        translate: (state.activeIndex - 1) * state.width
      }

    case "UPDATE_ACTIVE_INDEX":
      return {
        ...state,
        translate: action.index * state.width,
        activeIndex: action.index
      }

    case "RESIZE":
      return {
        ...state,
        translate: state.activeIndex * state.width
      }

    default: 
      return state
  }
}