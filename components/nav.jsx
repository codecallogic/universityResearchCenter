import React, {useState, useEffect, useRef} from 'react'
import {useRouter} from 'next/router'

const Nav = ({navMenu}) => {
  const router = useRouter()

  const [search, setSearch] = useState('')
  
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
        <img src="/media/logoHorizontal_cropped.png" className="nav-logo-mobile" onClick={() => window.location.href = '/'}/>
        <div className="nav-menu">
          {navMenu.length > 0 && navMenu.map((item, idx) => 
            <a href={ item.link ? item.link : ''} key={idx} className="nav-menu-item">{item.name}
              <ul className="nav-menu-dropdown">
              {item.item.length > 0 && item.item.map((list, idx2) => 
                <a key={idx2} href={`${list.link}`}>{list.name}</a>
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
      </nav>
    </div>
    </>
  )
}

export default Nav
