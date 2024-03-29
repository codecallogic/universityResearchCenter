import {combineReducers} from 'redux'
import {sliderReducer} from './slider'
import {slidesContentReducer} from './slidesContent'
import {headerReducer} from './header'
import {studentProfileReducer} from './studentProfile'
import {editRow} from './editRow'
import {webpageReducer} from './webpage'
import {administratorReducer} from './administrators'
import {navigationReducer} from './navigation'

const rootReducer = combineReducers({
  slider: sliderReducer,
  slidesContent: slidesContentReducer,
  header: headerReducer,
  studentProfile: studentProfileReducer,
  editRow: editRow,
  webpage: webpageReducer,
  administrator: administratorReducer,
  navigation: navigationReducer
})

export default rootReducer