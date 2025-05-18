// CopyRight.jsx
import React from 'react'
import './../css/copyRight.css'

function CopyRight() {
  return (
    <footer className="copyright-container">
      <p className="copyright-text">
        &copy; {new Date().getFullYear()} Job Portal. Made by{' '}
        <a
          href="https://www.linkedin.com/in/rahul-sanjay-panchal/"
          target="_blank"
          rel="noopener noreferrer"
          className="creator-link"
        >
          Rahul Panchal
        </a>
      </p>
    </footer>
  )
}

export default CopyRight
