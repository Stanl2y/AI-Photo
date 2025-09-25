import React from 'react';

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

// Fix: Replaced non-standard <style jsx> tag with Tailwind's `animate-spin` class.
// The `jsx` prop on `<style>` is a Next.js feature and is not supported in this React environment, causing a TypeScript error.
export const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`animate-spin ${className || ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 1 .8 19.584m8.73-3.462a2.25 2.25 0 0 1 2.475 2.118 3 3 0 0 0 5.78 1.128 2.25 2.25 0 0 1 2.475-2.118 2.25 2.25 0 0 1-.8-3.324m-1.385-1.19a2.25 2.25 0 0 0-3.464 0l-1.128 1.955a2.25 2.25 0 0 1-3.464 0l-1.128-1.955a2.25 2.25 0 0 0-3.464 0m11.238 0l-1.128 1.955a2.25 2.25 0 0 1-3.464 0l-1.128-1.955a2.25 2.25 0 0 0-3.464 0m11.238 0l-1.128 1.955a2.25 2.25 0 0 1-3.464 0l-1.128-1.955a2.25 2.25 0 0 0-3.464 0M3.882 8.322a2.25 2.25 0 0 0-1.171 1.955 2.25 2.25 0 0 1-.8 3.324 3 3 0 0 0 0 5.78 2.25 2.25 0 0 1 .8 3.324 2.25 2.25 0 0 1-2.475-2.118 3 3 0 0 0-5.78-1.128 2.25 2.25 0 0 1-2.475-2.118A2.25 2.25 0 0 1 3.882 8.322Z" />
    </svg>
);
