import React from 'react';

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{job.title}</h2>
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Experience Level:</strong> {job.experience_level.length ? job.experience_level.join(', ') : 'N/A'}</p>
        <p><strong>Category:</strong> {job.category.length ? job.category.join(', ') : 'N/A'}</p>
        <p><strong>Publication Date:</strong> {job.publication_date}</p>
        <p><strong>Remote:</strong> {job.remote ? 'Yes' : 'No'}</p>
        <p><strong>Sponsorship:</strong> {job.sponsorship ? 'Yes' : 'No'}</p>
        <p><strong>Description:</strong> <br />{job.description}</p>
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="apply-link">
          Apply Here
        </a>
      </div>
    </div>
  );
};

export default JobDetailsModal;
