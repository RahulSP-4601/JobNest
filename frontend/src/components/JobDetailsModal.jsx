import React from 'react';
import './../css/jobList.css';



const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  const formattedDate = job.publication_date
    ? new Date(job.publication_date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';
  
  

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="job-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close job details modal"
        >
          ×
        </button>

        <h2 id="job-title" className="modal-job-title">{job.title}</h2>

        <div className="modal-section">
          <h3>
            <p><strong>Company:</strong>{job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Experience Level:</strong> {job.experience_level?.length ? job.experience_level.join(', ') : 'N/A'}</p>
            <p><strong>Category:</strong> {job.category?.length ? job.category.join(', ') : 'N/A'}</p>
            <p><strong>Publication Date:</strong> {formattedDate}</p>
            <p><strong>Remote:</strong> {job.remote ? 'Yes' : 'No'}</p>
            <p><strong>Sponsorship:</strong> {job.sponsorship ? 'Yes' : 'No'}</p>
          </h3>
        </div>

        <hr />

        <div className="modal-description">
          <h2>Job Description</h2>
          <p>{job.description}</p>
        </div>

        <div className='apply-container'>
        <a href={job.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className='link'>
          Apply
        </a>
      </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
