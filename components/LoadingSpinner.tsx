
import React from 'react';

export default function LoadingSpinner(): React.JSX.Element {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
    </div>
  );
}
