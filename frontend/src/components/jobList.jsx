import React, { useState, useEffect } from 'react';
import SearchBar from './searchBar';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';
import './../css/JobList.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs from backend API
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/jobs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleCardClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  return (
    <div>
      <SearchBar />

      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="job-list-container">
        {!loading && !error && jobs.length === 0 && <p>No jobs found</p>}
        {jobs.map((job, idx) => (
          <JobCard key={idx} job={job} onClick={handleCardClick} />
        ))}
      </div>

      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default JobList;
