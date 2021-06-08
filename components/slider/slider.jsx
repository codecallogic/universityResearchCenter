import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import { useDispatch } from 'react-redux';
import SliderContent from './sliderContent'
import Slide from './Slide'
import Arrow from './Arrow'
import {useWindowSize} from '../../helpers/window'
import {rightColumnImages} from '../../helpers/sort'
import { css, cx } from '@emotion/css'
import axios from 'axios'

const Slider = ({slides, slider, header}) => {

  const dispatch = useDispatch()
  const size = useWindowSize();

  useEffect(() => {
    dispatch({type: 'WIDTH', width: window.innerWidth})
    handleResize()
  }, [size])

  const handleResize = () => {
    dispatch({type: 'RESIZE'})
  }

  const nextSlide = () => {
    if (slider.activeIndex === slides.length - 1) {
      return dispatch({type: 'BACK_TO_START'})
    }

    dispatch({type: 'NEXT_SLIDE'})
  }

  const prevSlide = () => {
    if (slider.activeIndex === 0) {
      return dispatch({type: 'LAST_SLIDE', length: slides.length})
    }

    dispatch({type: 'PREV_SLIDE'})
  }

  useEffect( () => {
    dispatch({
      type: 'SET_SLIDES',
      payload: rightColumnImages(header)
    })
  }, [header])

  return (
    <div className={cx(SliderCSS)}>
      <div>
      </div>
      <SliderContent
        translate={slider.translate}
        transition={slider.transition}
        width={slider.width * slides.length}
      >
        {header.map( slide => (
          <div key={slide._id} className={cx(css`
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            width: 100%;
          `)}>
          <Slide content={slide} slides={slides} activeIndex={slider.activeIndex}/>
          </div>  
        ))}
      </SliderContent>
      <Arrow direction="left" handleClick={prevSlide}/>
      <Arrow direction="right" handleClick={nextSlide}/>
    </div>
  )
}

const SliderCSS = css`
  position: relative;
  height: 50rem;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;

  @media only screen and (max-width: 992px) {
    height: 100rem;
  }
`

const mapStateToProps = state => {
    return {
        slider: state.slider,
        slides: state.slidesContent
    }
}

export default connect(mapStateToProps)(Slider)
