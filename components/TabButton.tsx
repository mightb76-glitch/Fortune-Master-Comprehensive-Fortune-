
import React from 'react';

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export default function TabButton({ label, icon, isActive, onClick }: TabButtonProps): React.JSX.Element {
  const baseClasses = "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const activeClasses = "bg-indigo-600 text-white shadow-md scale-105";
  const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

  return (
    <button
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
