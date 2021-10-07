
const Footer = ({}) => {
  
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
        <div className="footer-menu-item">Home</div>
        <div className="footer-menu-item">About</div>
        <div className="footer-menu-item">Students</div>
      </div>
    </div>
  )
}

export default Footer
