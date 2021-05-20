import React from 'react'
import {PUBLIC_FILES} from '../../config'
import { css, cx } from '@emotion/css'
import Dots from './Dots'

const Slide = ({content, slides, activeIndex, active}) => (
    <>
    <div
      className={cx(css`
        background-image: url('${PUBLIC_FILES}/${content.imageLeftColumn}');
      ` + ` slider-left-column`)}
    >
      <div>
        <h1 className="slider-left-column-title">{content.headline}</h1>
        <div className="slider-left-column-description">{content.subheading}</div>
        <a href={content.buttonLink} target="_blank" className="slider-left-column-button">{content.button}</a>
      </div>
      <Dots slides={slides} activeIndex={activeIndex}/>
    </div>
    <div
      className={cx(css`
        background-image: url('${PUBLIC_FILES}/${content.imageRightColumn}');
      ` + ` slider-right-column`)}
    >
      {content.captionOne ? <div className={cx(css`
        font-size: 2rem;
        position: absolute;
        bottom: 2rem;
        right: 4rem;
        color: white;
        background-color: rgba(75, 79, 77, .5);
        padding: 1rem 2rem;
        text-transform: capitalize;
        
        span {
          font-weight: 900;
          margin-right: 2rem;
        }
      `)}>
      {content.captionOne}
      </div>
      :
      null
      }
      {content.captionTwo ? 
      <div className={cx(css`
        font-size: 2rem;
        position: absolute;
        bottom: 12rem;
        right: 12rem;
        color: white;
        background-color: rgba(75, 79, 77, .5);
        padding: 1rem 2rem;
        text-transform: capitalize;
        
        span {
          font-weight: 900;
          margin-right: 2rem;
        }
      `)}>
      {content.captionTwo}
      </div>
      : null
      }
    </div>
    </>
)

export default Slide
