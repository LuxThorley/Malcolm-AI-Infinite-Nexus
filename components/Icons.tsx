
import React from 'react';

export const MalcolmIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'rgb(99, 102, 241)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'rgb(168, 85, 247)', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
      stroke="url(#grad1)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 7L12 12L22 7"
      stroke="url(#grad1)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 22V12"
      stroke="url(#grad1)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 15.5V8.5L12 12L4 8.5V15.5"
      stroke="url(#grad1)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
     <path
      d="M7 5.5L12 3L17 5.5"
      stroke="url(#grad1)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
