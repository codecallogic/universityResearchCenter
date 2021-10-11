import React, {useState, useEffect, useRef} from 'react'
import {useRouter} from 'next/router'
import SVG from '../files/svg'

const Nav = ({navMenu}) => {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [show, setShow] = useState('')
  
  const handleNav = (e) => {
    e.target.textContent.toLowerCase() == 'admin' ? window.open('/admin', '_blank', 'noopener,noreferrer') : null
  }

  const goToPage = (var1) => {
    window.open(`/${var1}`, '_blank', 'noopener,noreferrer')
  }

  const searchGoogle = (e) => {
    if(e.key == 'Enter') window.open(`https://www.google.com/search?q=${e.target.value}&as_rq=http://csms.calstatela.edu/`, '_blank')
    if(e == 'icon') window.open(`https://www.google.com/search?q=${search}&aas_rq=http://csms.calstatela.edu/`, '_blank')
  }
  
  return (
    <>
    <div className="nav-container">
      <nav className="nav">
        <img src="/media/logo-colorido.png" className="nav-logo" onClick={() => window.location.href = '/'}/>
        <img src="/media/logo-colorido-mobile.png" className="nav-logo-mobile" onClick={() => window.location.href = '/'}/>
        <div className="nav-menu">
          {navMenu.length > 0 && navMenu.map((item, idx) => 
            <a href={ item.link.length > 0 ? item.link : '#'} key={idx} className="nav-menu-item">{item.name}
              <ul className="nav-menu-dropdown">
              {item.item.length > 0 && item.item.map((list, idx2) => 
                <a key={idx2} href={`${list.link}`} target="_blank">{list.name}</a>
              )
              }
              </ul>
            </a>
          )}
          <div className="form-group-search">
            <input type="text" name="search" placeholder="Search" onKeyDown={(e) => searchGoogle(e)} onChange={(e) => setSearch(e.target.value)} value={search}/>
            <svg name="icon" onClick={() => searchGoogle('icon')}>
              <use xlinkHref="sprite.svg#icon-search"></use>
            </svg>
          </div>
        </div>
        <div className="nav-menu-mobile">
          <input type="checkbox" id="navi-toggle" className="nav-menu-mobile-checkbox"/>
          <label htmlFor="navi-toggle" className="nav-menu-mobile-button" onClick={null}>
            <span className="nav-menu-mobile-icon"></span>
          </label>
          <div className="nav-menu-mobile-background"></div>
          <div className="nav-menu-mobile-background-2"></div>
          <div className="nav-menu-mobile-nav">
            <div className={`nav-menu-mobile-nav-container ` + (show == '' ? 'show' : 'hide')}>
            {navMenu.length > 0 && navMenu.map((item, idx) => 
              <a href={ item.link.length > 0 ? item.link : '#'} key={idx} className="nav-menu-mobile-nav-item" onClick={() => item.item.length > 0 ? setShow(item._id) : null}>{item.name}
                {item.item.length > 0 && <SVG svg={'arrow-right-thick'}></SVG>}
                {/* <ul className="nav-menu-moblie-dropdown">
                {item.item.length > 0 && item.item.map((list, idx2) => 
                  <a key={idx2} href={`${list.link}`} target="_blank">{list.name}</a>
                )
                }
                </ul> */}
              </a>
            )}
            </div>
            {show && navMenu.map((list, idx) => 
              list._id == show ? 
              // console.log(list)
              <div key={idx} className={`nav-menu-mobile-nav-container ` + (show == '' ? 'hide' : 'show')}>
                <div className="nav-menu-mobile-nav-item-back" onClick={() => setShow('')}><SVG svg={'arrow-left-thick'}></SVG> {list.name}</div>
                {list.item.length > 0 && list.item.map((item, idx2) => 
                  <a key={idx2} href={item.link}className="nav-menu-mobile-nav-item">{item.name}
                  </a>
                )}
              </div>
              :
              null
            )
            }
          </div>
          <div className="nav-close nav-menu-mobile-close" onClick={() => document.getElementById('navi-toggle').checked = false}>
            <span className="nav-close-svg"><SVG svg={'close'}></SVG></span>
          </div>
        </div>
      </nav>
    </div>
    </>
  )
}

export default Nav
