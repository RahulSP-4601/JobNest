import React from 'react'
import './../css/home.css'
import Companies from './companies.jsx';
import { Link } from 'react-router-dom'
function Home() {
  return (
    <div className='head'>
      <div className='head1 funnel-sans-font'>
        <span className="size">Search, Apply & Get Your </span> <br /> <span className='dreamJob'>Dream Job</span>
      </div>


      <div className='getStarted funnel-sans-font'>
        <Link to="/jobs" className="size1">Get Started</Link>
      </div>

      <div className='companies'>
        <Companies />
      </div>
    </div>
  )
}

export default Home
