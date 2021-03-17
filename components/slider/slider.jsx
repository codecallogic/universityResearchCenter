import React, {useState, useEffect} from 'react'
import SliderContent from './sliderContent'
import Slide from './Slide'
import Arrow from './Arrow'
import { css, cx } from '@emotion/css'

const Header = ({slides}) => {

  useEffect(() => {
    setWidth(window.innerWidth);
  }, [])

  const [width, setWidth] = useState(0)
  const [state, setState] = useState({
    translate: 0,
    transition: 0.45,
    activeIndex: 0
  })

  const { translate, transition, activeIndex } = state

  const nextSlide = () => {
    if (activeIndex === slides.length - 1) {
      return setState({
        ...state,
        translate: 0,
        activeIndex: 0
      })
    }

    setState({
      ...state,
      activeIndex: activeIndex + 1,
      translate: (activeIndex + 1) * window.innerWidth
    })
  }

  const prevSlide = () => {
    if (activeIndex === 0) {
      return setState({
        ...state,
        translate: (slides.length - 1) * window.innerWidth,
        activeIndex: slides.length - 1
      })
    }

    setState({
      ...state,
      activeIndex: activeIndex - 1,
      translate: (activeIndex - 1) * window.innerWidth
    })
  }

  return (
    <div className={cx(SliderCSS)}>
      <SliderContent
        translate={translate}
        transition={transition}
        width={width * slides.length}
      >
        {slides.map( slide => (
          <div key={slide} className={cx(css`
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            width: 100%;
          `)}>
          <Slide key={slide} content={slide} slides={slides} activeIndex={activeIndex}/>
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
  height: 45rem;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
`

export default Header
