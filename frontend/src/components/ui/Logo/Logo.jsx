import React from "react";
import "./Logo.css";

export default function Logo({ size = "md", showText = true }) {
  const sizeClasses = {
    sm: "logo-sm",
    md: "logo-md",
    lg: "logo-lg",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
  };

  return (
    <div className="logo-container">
      <div className={`logo-icon ${sizeClasses[size]}`}>
        <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="url(#gradient)" />
          <circle cx="12" cy="12" r="3" fill="white" />
          <circle cx="28" cy="12" r="3" fill="white" />
          <circle cx="20" cy="28" r="3" fill="white" />
          <circle cx="20" cy="20" r="2.5" fill="white" />

          <line x1="12" y1="12" x2="20" y2="20" stroke="white" strokeWidth="2" />
          <line x1="28" y1="12" x2="20" y2="20" stroke="white" strokeWidth="2" />
          <line x1="20" y1="28" x2="20" y2="20" stroke="white" strokeWidth="2" />

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <span className={`logo-text ${textSizeClasses[size]}`}>Connecto</span>
      )}
    </div>
  );
}
