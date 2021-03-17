import React from 'react'
import { css, cx } from '@emotion/css'

const Dot = ({ active }) => (
  <span
    className={cx(css`
      padding: 10px;
      margin-right: 3rem;
      cursor: pointer;
      border-radius: 50%;
      background: ${active ? '#4056a1' : 'white'};
    `)}
  />
)

const Dots = ({ slides, activeIndex }) => (
  <div
    className={cx(css`
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
    `)}
  >
    {slides.map((slide, i) => (
      <Dot key={slide} active={activeIndex === i} />
    ))}
  </div>
)

export default Dots