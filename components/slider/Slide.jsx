import React from 'react'
import { css, cx } from '@emotion/css'
import Dots from './Dots'

const Slide = ({content, slides, activeIndex, active}) => (
    <>
    <div
      className={cx(css`
        grid-column: 1/5;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: center;
        align-items: center;
        padding: 0 5rem 0 10rem;
        height: 100%;
        width: 100%;
        background-image: url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?ixid=MXwxMjA3fDB8MHxzZWFyY2h8N3x8ZGFyayUyMGJhY2tncm91bmQlMjBwYXR0ZXJuc3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60');
      `)}
    >
      <h1 className="slider-left-column-title">Deep Life</h1>
      <div className="slider-left-column-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum eligendi voluptatum itaque ullam alias nemo nam possimus, assumenda minima sit officiis. Harum ducimus atque architecto cum delectus sequi ab provident?</div>
      <button className="slider-left-column-button">About our research</button>
      <Dots slides={slides} activeIndex={activeIndex}/>
    </div>
    <div
      className={cx(css`
        grid-column: 5/-1;
        height: 100%;
        width: 100%;
        background-image: url('${content}');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      `)}
    />
    </>
)

export default Slide
