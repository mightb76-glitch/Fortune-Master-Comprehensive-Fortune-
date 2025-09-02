import React from 'react';

interface IconProps {
    className?: string;
}

export const FaceIcon = ({ className = "h-5 w-5" }: IconProps): React.JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

export const HandIcon = ({ className = "h-5 w-5" }: IconProps): React.JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 3.5a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0V4.25A.75.75 0 0110 3.5zM8.5 5.5a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5H9.25a.75.75 0 01-.75-.75zM10 7a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V7z" />
    <path fillRule="evenodd" d="M4.5 1.5A2.5 2.5 0 002 4v10.5a2.5 2.5 0 002.5 2.5h11A2.5 2.5 0 0018 14.5V4a2.5 2.5 0 00-2.5-2.5h-11zM3.5 4a1 1 0 011-1h11a1 1 0 011 1v10.5a1 1 0 01-1 1h-11a1 1 0 01-1-1V4z" clipRule="evenodd" />
  </svg>
);

export const StarIcon = ({ className = "h-5 w-5" }: IconProps): React.JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const TarotIcon = ({ className = "h-5 w-5" }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1.586l-1.707 1.707A1 1 0 002 7v6a1 1 0 001 1h2.586l1.707 1.707A1 1 0 008 16h4a1 1 0 00.707-.293L14.414 14H17a1 1 0 001-1V7a1 1 0 00-.293-.707L16 4.586V3a1 1 0 00-1-1H5zm10 3.414L13.414 7H12v6h1.414L15 11.414V5.414zM10 8a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

export const AIEyeIcon = ({ className = "h-12 w-12 text-indigo-400" }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 9v-4" />
        <path d="M12 15v4" />
        <path d="M9 12H5" />
        <path d="M19 12h-4" />
    </svg>
);

export const MicrophoneIcon = ({ className = "h-5 w-5" }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
        <path d="M5.5 11.5a.5.5 0 01.5-.5h8a.5.5 0 010 1h-8a.5.5 0 01-.5-.5z" />
        <path d="M10 18a7 7 0 007-7h-1.5a5.5 5.5 0 11-11 0H3a7 7 0 007 7z" />
    </svg>
);

export const UploadIcon = ({ className = "h-5 w-5" }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const CameraIcon = ({ className = "h-5 w-5" }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const CaptureIcon = ({ className = "h-6 w-6 text-white" }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const SwitchCameraIcon = ({ className = "h-6 w-6 text-white" }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0114.13-5.26M20 15a9 9 0 01-14.13 5.26" />
    </svg>
);

export const ShareIcon = ({ className = "h-5 w-5" }: IconProps): React.JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
);