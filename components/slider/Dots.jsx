import React from 'react'
import {connect} from 'react-redux'
import { useDispatch } from 'react-redux';
import { css, cx } from '@emotion/css'

const Dot = ({ active, index }) => {

  const dispatch = useDispatch()

  const goToSlide = () => {
    dispatch({type: "UPDATE_ACTIVE_INDEX", index: index})
  }

  return (
    <span
    onClick={goToSlide} 
    className={cx(css`
      padding: 10px;
      margin: 3rem 0 0 0;
      margin-right: 3rem;
      cursor: pointer;
      border-radius: 50%;
      background: ${active ? 'rgb(0, 183, 236)' : 'white'};
    `)}
    />)
}

const Dots = ({ slides, activeIndex }) => {
  return (
    <div
    className={cx(css`
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
    `)}
    >
    {slides.map((slide, i) => (
      <Dot key={slide} active={activeIndex === i} index={i}/>
    ))}
    </div>
  )
}

export default Dots