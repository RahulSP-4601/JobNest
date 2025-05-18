import React from 'react'
import './../css/about.css'
import CopyRight from './copyRight.jsx'

function About() {
  return (
    <section className='about-container funnel-sans-font'>
      <header className='about-header'>
        <h1>JobNest : Online Job Portal</h1>
      </header>

      <div className='about-section'>
        <h2 className='section-title'><strong>Project Summary</strong></h2>
        <ul>
          <li><strong>Type:</strong> Personal project</li>
          <li><strong>Goal:</strong> Learn web scraping & Docker deployment</li>
        </ul>
      </div>

      <div className='about-section'>
        <h2 className='section-title'><strong>TechStack</strong></h2>
        <p>HTML • CSS • JavaScript • ReactJS • Python • Docker</p>
      </div>

      <div className='about-section'>
        <h2 className='section-title'><strong>Description</strong></h2>
        <p>
          <strong>JobNest</strong> is a full-stack web app built from scratch to deepen my understanding of <strong>web scraping
          and docker deployment</strong>. Initial attempts to scrape LinkedIn ran into authentication
          barriers, so I pivoted to <strong>The Muse</strong>, which allows scraping up to <strong>40 postings</strong> at a time
          and offers a free jobs API. Other platforms such as RemoteOK enforce similar limits, so I capped
          my fetches at <strong>200-300</strong> listings spanning the <strong>past 24 hours to 2 months.</strong> Working within these
          constraints was a valuable lesson in respectful scraping and rate-limit management.
        </p>
      </div>

      <div className='about-section'>
        <h2 className='section-title'><strong>About-Me</strong></h2>
        <p>
          Rahul Sanjay Panchal<br />
          <a href='https://www.linkedin.com/in/rahul-sanjay-panchal/' target='_blank' rel='noreferrer'>LinkedIn</a> |
          <a href='https://rahulsp-4601.github.io/RahulPortfolio/' target='_blank' rel='noreferrer'>Portfolio</a> | 
          <a href='https://github.com/RahulSP-4601' target='_blank' rel='noreferrer'>GitHub</a>
        </p>
      </div>

      <CopyRight />
    </section>
  )
}

export default About
