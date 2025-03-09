'use client';

import { Tab } from '@headlessui/react';

interface ViewToggleProps {
  view: 'daily' | 'cumulative';
  onChange: (view: 'daily' | 'cumulative') => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <Tab.Group selectedIndex={view === 'daily' ? 0 : 1} onChange={index => onChange(index === 0 ? 'daily' : 'cumulative')}>
      <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 p-1">
        <Tab
          className={({ selected }) =>
            `w-full rounded-lg py-2.5 px-6 text-sm font-medium leading-5 transition-all duration-200
            ${selected
              ? 'bg-white text-blue-700 shadow'
              : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'
            }`
          }
        >
          Daily
        </Tab>
        <Tab
          className={({ selected }) =>
            `w-full rounded-lg py-2.5 px-6 text-sm font-medium leading-5 transition-all duration-200
            ${selected
              ? 'bg-white text-blue-700 shadow'
              : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'
            }`
          }
        >
          Cumulative
        </Tab>
      </Tab.List>
    </Tab.Group>
  );
} 