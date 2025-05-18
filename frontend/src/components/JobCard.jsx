import React from 'react';

const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

const JobCard = ({ job, onClick, searchTerm }) => {
  const formattedDate = job.publication_date?.split('T')[0] || 'N/A';

  return (
    <div
      className="job-card funnel-sans-font"
      onClick={() => onClick(job)}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="header"
        dangerouslySetInnerHTML={{
          __html: highlightMatch(job.title, searchTerm),
        }}
      />
      <div className="content">
        <div className="info-pair">
          <strong>Company:</strong>{' '}
          <span
            dangerouslySetInnerHTML={{
              __html: highlightMatch(job.company, searchTerm),
            }}
          />
        </div>
        <div className="info-pair"><strong>Location:</strong> {job.location}</div>
        <div className="info-pair"><strong>Experience:</strong> {job.experience_level.length ? job.experience_level.join(', ') : 'N/A'}</div>
        <div className="info-pair"><strong>Date:</strong> {formattedDate}</div>
      </div>
      <div className="apply-container">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="link"
        >
          Apply
        </a>
      </div>
    </div>
  );
};

export default JobCard;
