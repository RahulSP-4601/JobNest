import React from 'react'
import './../css/home.css'
import Companies from './companies.jsx';
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='head funnel-sans-font'>
      <div className='head1'>
        <div className="size" style={{ fontSize: '90px', fontWeight: 600 }}>
          Search, Apply & Get Your
        </div>
        <div className='dreamJob' style={{ fontSize: '90px', fontWeight: 600 }}>
          Dream Job
        </div>
      </div>

      <div className='getStarted funnel-sans-font'>
        <Link to="/jobs" className="size1" style={{ fontSize: '80px', fontWeight: 600 }}>
          Get Started
        </Link>
      </div>

      <div className='companies'>
        <Companies />
      </div>
    </div>
  )
}

export default Home
