'use client';

import { useMemo } from 'react';
import { CombinedData } from '@/types';
import { format, subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface StatsCalloutProps {
  data: CombinedData;
}

export default function StatsCallout({ data }: StatsCalloutProps) {
  const stats = useMemo(() => {
    // Get current date in Malaysia timezone
    const msiaDate = toZonedTime(new Date(), 'Asia/Kuala_Lumpur');
    const yesterday = subDays(msiaDate, 1);
    
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
    const todayStr = format(msiaDate, 'yyyy-MM-dd');
    
    console.log('Malaysia Today:', todayStr);
    console.log('Malaysia Yesterday:', yesterdayStr);
    console.log('Available dates:', data.daily.labels);
    
    // Find yesterday's index
    const yesterdayIndex = data.daily.labels.findIndex(date => date === yesterdayStr);
    const todayIndex = data.daily.labels.findIndex(date => date === todayStr);
    
    console.log('Yesterday Index:', yesterdayIndex);
    console.log('Today Index:', todayIndex);
    
    return {
      dailyKPs: yesterdayIndex >= 0 ? data.daily.actual[yesterdayIndex] : null,
      cumulativeKPs: yesterdayIndex >= 0 ? data.cumulative.actual[yesterdayIndex] : null,
      currentTarget: todayIndex >= 0 ? data.daily.target[todayIndex] : null
    };
  }, [data]);

  return (
    <div className="grid grid-cols-3 gap-8 w-full max-w-3xl mx-auto mb-4">
      <div className="text-center">
        <dt className="text-sm font-medium text-gray-600 mb-1">Daily KPs</dt>
        <dd className="text-2xl font-bold text-gray-900">
          {stats.dailyKPs !== null ? `+${stats.dailyKPs.toLocaleString()}` : '-'}
        </dd>
      </div>
      <div className="text-center">
        <dt className="text-sm font-medium text-gray-600 mb-1">Cumulative KPs</dt>
        <dd className="text-2xl font-bold text-gray-900">
          {stats.cumulativeKPs !== null ? (
            <>
              {stats.cumulativeKPs.toLocaleString()}
              <span className="text-base font-medium text-gray-600 ml-1"> / 5,478</span>
            </>
          ) : '-'}
        </dd>
      </div>
      <div className="text-center">
        <dt className="text-sm font-medium text-gray-600 mb-1">Current Target</dt>
        <dd className="text-2xl font-bold text-gray-900">
          {stats.currentTarget !== null ? (
            <>
              {stats.currentTarget.toLocaleString()}
              <span className="text-base font-medium text-gray-600 ml-1"> / day</span>
            </>
          ) : '-'}
        </dd>
      </div>
    </div>
  );
} 