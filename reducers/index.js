import {combineReducers} from 'redux'
import {sliderReducer} from './slider'
import {slidesContentReducer} from './slidesContent'
import {headerReducer} from './header'
import {studentProfileReducer} from './studentProfile'

const rootReducer = combineReducers({
  slider: sliderReducer,
  slidesContent: slidesContentReducer,
  header: headerReducer,
  studentProfile: studentProfileReducer
})

export default rootReducer