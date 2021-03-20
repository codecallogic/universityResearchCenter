import {combineReducers} from 'redux'
import {sliderReducer} from './slider'
import {slidesContentReducer} from './slidesContent'
import {headerReducer} from './header'

const rootReducer = combineReducers({
  slider: sliderReducer,
  slidesContent: slidesContentReducer,
  header: headerReducer
})

export default rootReducer