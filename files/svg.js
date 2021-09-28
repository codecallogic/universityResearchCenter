import React from "react";

const SVGs = ({svg, classprop}) => {

  const selectSVG = (svg) => {
    switch (svg) {
      case 'keyboard-right':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>Keyboard Right</title>
        <path d="M8.578 16.594l4.594-4.594-4.594-4.594 1.406-1.406 6 6-6 6z"></path>
        </svg>
        break;

      case 'user':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <title>User</title>
        <path d="M23.797 20.922c-0.406-2.922-1.594-5.516-4.25-5.875-1.375 1.5-3.359 2.453-5.547 2.453s-4.172-0.953-5.547-2.453c-2.656 0.359-3.844 2.953-4.25 5.875 2.172 3.063 5.75 5.078 9.797 5.078s7.625-2.016 9.797-5.078zM20 10c0-3.313-2.688-6-6-6s-6 2.688-6 6 2.688 6 6 6 6-2.688 6-6zM28 14c0 7.703-6.25 14-14 14-7.734 0-14-6.281-14-14 0-7.734 6.266-14 14-14s14 6.266 14 14z"></path>
        </svg>
        
      case 'password':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <title>Password</title>
        <path d="M29 32h-26c-0.552 0-1-0.447-1-1v-16c0-0.553 0.448-1 1-1h3v-4c0-5.523 4.477-10 10-10s10 4.477 10 10v4h3c0.553 0 1 0.447 1 1v16c0 0.553-0.447 1-1 1zM22 9.5c0-3.038-2.687-5.5-6-5.5s-6 2.462-6 5.5v4.5h12v-4.5z"></path>
        </svg>
        break;

      case 'email':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <title>Password</title>
        <path d="M0 38c0 2.21 1.79 4 4 4h40c2.21 0 4-1.79 4-4l-0-27c0-2.21-1.79-4-4-4l-40 0c-2.21 0-4 1.79-4 4v27zM14.72 24.53l-9.15-9.21c-0.759-0.76-0.759-1.99 0-2.75 0.761-0.76 1.991-0.76 2.75 0l14.6 14.619c0.59 0.58 1.561 0.58 2.141 0l14.619-14.619c0.76-0.76 1.99-0.76 2.75 0s0.76 1.99 0 2.75l-9.16 9.21 9.16 9.149c0.76 0.76 0.76 1.99 0 2.75s-1.99 0.76-2.75 0l-9.15-9.14c0 0-2.859 2.91-3.379 3.43-0.811 0.791-1.931 1.281-3.151 1.281-1.24 0-2.36-0.5-3.17-1.311-0.53-0.52-3.37-3.399-3.37-3.399l-9.141 9.14c-0.759 0.76-1.989 0.76-2.75 0-0.759-0.76-0.759-1.99 0-2.75l9.151-9.15z"></path>
        </svg>
        break;

      default:
        break;
    }
  }
  
  return (
    <>
      {selectSVG(svg)}
    </>
  )
}

export default SVGs
