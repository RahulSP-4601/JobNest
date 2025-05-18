import React from 'react';

const JobCard = ({ job, onClick }) => {
  return (
    <div className="job-card" onClick={() => onClick(job)} style={{ cursor: 'pointer' }}>
      <h3>{job.title}</h3>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Experience:</strong> {job.experience_level.length ? job.experience_level.join(', ') : 'N/A'}</p>
      <p><strong>Category:</strong> {job.category.length ? job.category.join(', ') : 'N/A'}</p>
      <p><strong>Date:</strong> {job.publication_date}</p>
      <a href={job.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
        Apply
      </a>
    </div>
  );
};

export default JobCard;
