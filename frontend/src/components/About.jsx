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
          <li><strong>Type:</strong> Personal Project</li>
          <li><strong>Goal:</strong> To learn Web Scraping and Docker Deployment</li>
        </ul>
      </div>

      <div className='about-section'>
        <h2 className='section-title'><strong>Tech Stack</strong></h2>
        <p>HTML • CSS • JavaScript • ReactJS • Python • Docker</p>
      </div>

      <div className='about-section'>
        <h2 className='section-title'><strong>Description</strong></h2>
        <p>
          <strong>JobNest</strong> is a full-stack web application built from scratch to enhance my skills in
          <strong> Web Scraping, Docker Deployment, and Google Cloud Hosting</strong>. My initial approach to scraping LinkedIn
          faced authentication challenges, so I switched to <strong>The Muse</strong>, which provides a free jobs API and allows scraping up to
          <strong> 40 job postings</strong> at a time. Other platforms, like RemoteOK, have similar restrictions, so I limited my data fetches to
          <strong> 200–300 job listings</strong> spanning the <strong>past 24 hours to 2 months</strong>. This experience taught me valuable lessons
          in respectful scraping and rate-limit handling.
        </p>
        <br />
        <p>
          <strong>Key Features:</strong>
        </p>
        <ul>
          <li>Scraped <strong>50 jobs</strong> and <strong>Fetched over 200 - 300 realtime jobs data</strong> using <strong>The Muse API.</strong></li>
          <li>Implemented a powerful <strong>Search Functionality</strong> for easy job discovery.</li>
          <li>
            Added filtering options based on <strong>Posting Date</strong>:
            <ul>
              <li>Last 1 day</li>
              <li>Last 3 days</li>
              <li>Last 7 days</li>
              <li>Last 15 days</li>
              <li>Last 1 month</li>
              <li>Last 2 months</li>
            </ul>
          </li>
          <li>
            Added filtering options based on <strong>Experience Level</strong>:
            <ul>
              <li>Entry Level</li>
              <li>Mid Level</li>
              <li>Senior Level</li>
            </ul>
          </li>
          <li>
            <strong>Displayed job details fetched from The Muse, including:</strong>
            <ul>
              <li>Job Title</li>
              <li>Company Name</li>
              <li>Experience Level</li>
              <li>Date Posted</li>
              <li>Job Description</li>
              <li>Apply Link</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className='about-section'>
        <h2 className='section-title'><strong>About Me</strong></h2>
        <p>
          Rahul Sanjay Panchal<br />
          <a href='https://www.linkedin.com/in/rahul-sanjay-panchal/' target='_blank' rel='noreferrer'>LinkedIn</a> |
          <a href='https://rahulsp-4601.github.io/RahulPortfolio/' target='_blank' rel='noreferrer'> Portfolio</a> |
          <a href='https://github.com/RahulSP-4601' target='_blank' rel='noreferrer'> GitHub</a>
        </p>
      </div>

      <CopyRight />
    </section>
  )
}

export default About
