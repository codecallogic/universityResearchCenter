import React from 'react'
import { css, cx } from '@emotion/css'

const Arrow = ({ direction, handleClick }) => (
  <div
    onClick={handleClick}
    className={cx(css`
      display: flex;
      position: absolute;
      top: 50%;
      ${direction === 'right' ? `right: 25px` : `left: 25px`};
      height: 50px;
      width: 50px;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      align-items: center;
      transition: transform ease-in 0.1s;
      &:hover {
        transform: scale(1.1);
      }
      svg {
        transform: translateX(${direction === 'left' ? '-2' : '2'}px);
        height: 3rem;
        width: 3rem;
        fill: white;
        &:focus {
          outline: 0;
        }
      }
    `)}
  >
    {direction === 'right' ? <svg className="slider-icon-right"><use xlinkHref="/sprite.svg#icon-circle-right"></use></svg> : <svg className="slider-icon-left"><use xlinkHref="/sprite.svg#icon-circle-left"></use></svg>}
  </div>
)

export default Arrow