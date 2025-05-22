import React, { useState, useEffect } from 'react';
import SearchBar from './searchBar';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';
import '../css/jobList.css';

// Resolve backend base URL from env (Docker or dev)
//const API_BASE = import.meta.env.VITE_BACKEND_URL;  // || 'http://localhost:5001';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const jobsPerPage = 8;

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs"); 
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

  const now = new Date();

  const filteredJobs = jobs
    .filter((job) => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(lowerSearch) ||
        job.company.toLowerCase().includes(lowerSearch);

      const jobDate = new Date(job.publication_date);
      const diffInDays = (now - jobDate) / (1000 * 60 * 60 * 24);
      const matchesDate = !dateFilter || diffInDays <= parseInt(dateFilter);
      const matchesExperience =
        !experienceFilter || job.experience_level?.includes(experienceFilter);

      return matchesSearch && matchesDate && matchesExperience;
    })
    .sort((a, b) => new Date(a.publication_date) - new Date(b.publication_date));

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, experienceFilter]);

  return (
    <div>
      <div className="filters-wrapper">
        <div className="header-controls">
          <select
            className="filters-wrapper filter-dropdown"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">All Dates</option>
            <option value="1">Last 1 Day</option>
            <option value="3">Last 3 Days</option>
            <option value="7">Last 7 Days</option>
            <option value="15">Last 15 Days</option>
            <option value="30">Last 1 Month</option>
            <option value="60">Last 2 Months</option>
          </select>

          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <select
            className="filters-wrapper filter-dropdown"
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
          >
            <option value="">All Experience</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="job-list-container">
        {!loading && !error && currentJobs.length === 0 && <p>No jobs found</p>}
        {currentJobs.map((job, idx) => (
          <JobCard
            key={idx}
            job={job}
            searchTerm={searchTerm}
            onClick={() => setSelectedJob(job)}
          />
        ))}
      </div>

      {filteredJobs.length > jobsPerPage && (
        <div className="pagination">
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span> Page {currentPage} of {totalPages} </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

export default JobList;
