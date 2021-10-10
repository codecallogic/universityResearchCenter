
const Footer = ({navMenu}) => {
  
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src="/media/logo-colorido.png" className="nav-logo"/>
          <img src="/media/logoHorizontal_cropped.png" className="nav-logo-mobile"/>
        </div>
        <div className="footer-description">
          This material is based upon work supported by the National Science Foundation under Grant HRD-1834620. Any opinions, findings, and conclusions or recommendations expressed in this material are those of the authors and do not necessarily reflect the views of the National Science Foundation.
        </div>
      </div>
      <div className="footer-menu">
        {navMenu.length > 0 && navMenu.map((item, idx) => 
          <a href={ item.link ? item.link : ''} key={idx} className="footer-menu-item">{item.name}
            <ul className="footer-menu-dropdown">
            {item.item.length > 0 && item.item.map((list, idx2) => 
              <a key={idx2} href={`${list.link}`} target="_blank">{list.name}</a>
            )
            }
            </ul>
          </a>
        )}
      </div>
    </div>
  )
}

export default Footer
