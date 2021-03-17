import React from 'react'
import { css, cx } from '@emotion/css'

const Dot = ({ active }) => (
  <span
    className={cx(css`
      padding: 10px;
      margin-right: 5px;
      cursor: pointer;
      border-radius: 50%;
      background: ${active ? '#4056a1' : 'white'};
    `)}
  />
)

const Dots = ({ slides, activeIndex }) => (
  <div
    className={cx(css`
      position: absolute;
      bottom: 25px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    `)}
  >
    {slides.map((slide, i) => (
      <Dot key={slide} active={activeIndex === i} />
    ))}
  </div>
)

export default Dots