const initialState = {
  name: '',
  link: '',
  item: []
}

export const navigationReducer = (state = initialState, action) =>  {
  switch (action.type) {
    case 'RESET_NAV':
      return initialState

    case 'CREATE_NAV_MENU':
      return {
        ...state,
        [action.name]: action.value
      }
      break;

    case 'ADD_NAV_ITEM':
      if(state.item.some((item) => item == action.value)){
        let array = []
        
        state.item.filter((listItem) => {
          if(listItem !== action.value) array.push(listItem)
        })

        return {
          item: array
        }
      }
      
      return {
        ...state,
        item: [...state.item, action.value]
      }

    case 'RESET_NAV_ITEMS':
      return {
        ...state,
        item: []
      }
      
    default:
      return state
  }
}