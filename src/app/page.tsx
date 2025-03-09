'use client';

import { useState, useCallback, useEffect } from 'react';
import DailyChart from '@/components/DailyChart';
import CumulativeChart from '@/components/CumulativeChart';
import ViewToggle from '@/components/ViewToggle';
import TimeRangeSlider from '@/components/TimeRangeSlider';
import { CombinedData, ChartData } from '@/types';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Inter } from 'next/font/google';
import InspirationQuote from '@/components/InspirationQuote';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [view, setView] = useState<'daily' | 'cumulative'>('daily');
  const [data, setData] = useState<CombinedData>({
    daily: { labels: [], actual: [], target: [] },
    cumulative: { labels: [], actual: [], target: [] }
  });
  const [dateRange, setDateRange] = useState<[number, number]>([0, 0]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [quote, setQuote] = useState<string>('');
  const [showQuote, setShowQuote] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/progress');
      const newData = await response.json();
      setData(newData);
      
      // Only set full date range on initial load
      if (isInitialLoad) {
        setDateRange([0, newData.daily.labels.length - 1]);
        setIsInitialLoad(false);
      }
      
      setLastUpdated(new Date());

      // Fetch the quote
      const quoteResponse = await fetch('/api/quote');
      const quoteJson = await quoteResponse.json();
      setQuote(quoteJson.quote);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [isInitialLoad]);

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'i') {
        event.preventDefault();
        setShowQuote(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRangeChange = (startIndex: number, endIndex: number) => {
    setDateRange([startIndex, endIndex]);
  };

  const getFilteredData = (data: ChartData) => {
    const [start, end] = dateRange;
    return {
      labels: data.labels.slice(start, end + 1),
      actual: data.actual.slice(start, end + 1),
      target: data.target.slice(start, end + 1)
    };
  };

  return (
    <main className={`min-h-screen bg-white p-6 ${inter.className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center space-y-6 mb-6">
          <h1 className="text-3xl font-light text-gray-900 tracking-wide">Joyce Lee, CFA</h1>
          <div className="flex flex-col items-center gap-3">
            <ViewToggle view={view} onChange={setView} />
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#346ff3] text-white text-sm font-medium rounded-md hover:bg-[#2756c2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#346ff3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ArrowPathIcon className={`h-4 w-4 transition-transform duration-700 ${isLoading ? 'animate-spin' : 'hover:rotate-180'}`} />
              Refresh
            </button>
            <span className="text-sm text-gray-500 transition-opacity duration-200">
              {lastUpdated ? `Last updated: ${lastUpdated.toLocaleString()}` : 'Not updated yet'}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className={`bg-white transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="h-[60vh]">
            {view === 'daily' ? (
              <DailyChart data={getFilteredData(data.daily)} />
            ) : (
              <CumulativeChart data={getFilteredData(data.cumulative)} />
            )}
          </div>
          <TimeRangeSlider
            dates={data.daily.labels}
            onRangeChange={handleRangeChange}
          />
        </div>
      </div>
      <InspirationQuote 
        quote={quote} 
        isVisible={showQuote} 
        onClose={() => setShowQuote(false)} 
      />
    </main>
  );
}
