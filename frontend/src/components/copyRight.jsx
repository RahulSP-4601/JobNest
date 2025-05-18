import React from 'react'
import './../css/copyRight.css'

function copyRight() {
  return (
    <footer className="copyright-container">
      <p className="copyright-text">
        &copy; {new Date().getFullYear()} Job Portal. Made by{' '}
        <a
          href="https://www.linkedin.com/in/rahul-sanjay-panchal/" // Replace with your real LinkedIn
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

export default copyRight
