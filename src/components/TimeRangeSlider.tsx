import { useState, useEffect } from 'react';
import { Slider } from '@mui/material';
import { format, addDays } from 'date-fns';

interface TimeRangeSliderProps {
  dates: string[];
  onRangeChange: (startIndex: number, endIndex: number) => void;
}

export default function TimeRangeSlider({ dates, onRangeChange }: TimeRangeSliderProps) {
  const [initialized, setInitialized] = useState(false);
  const [range, setRange] = useState<number[]>([0, 0]);

  // One-time initialization when dates are available
  useEffect(() => {
    if (!initialized && dates.length > 0) {
      const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0];
      const endIndex = dates.findIndex(date => date > tomorrow);
      const finalIndex = endIndex === -1 ? dates.length - 1 : endIndex - 1;
      
      setRange([0, finalIndex]);
      onRangeChange(0, finalIndex);
      setInitialized(true);
    }
  }, [dates, initialized, onRangeChange]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    const [start, end] = newValue as number[];
    setRange([start, end]);
    onRangeChange(start, end);
  };

  const valueLabelFormat = (value: number) => {
    if (dates[value]) {
      return format(new Date(dates[value]), 'MMM d');
    }
    return '';
  };

  if (dates.length === 0) return null;

  return (
    <div className="px-4 py-4">
      <Slider
        value={range}
        onChange={handleChange}
        valueLabelDisplay="auto"
        valueLabelFormat={valueLabelFormat}
        min={0}
        max={Math.max(0, dates.length - 1)}
        size="small"
        sx={{
          '& .MuiSlider-thumb': {
            backgroundColor: '#d1d5db',
            width: 12,
            height: 12,
            '&:hover': {
              backgroundColor: '#346ff3',
              width: 14,
              height: 14,
            },
            '&.Mui-active': {
              backgroundColor: '#346ff3',
            }
          },
          '& .MuiSlider-track': {
            backgroundColor: '#d1d5db',
            height: 3,
            '.Mui-active &': {
              backgroundColor: '#346ff3',
            }
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#f3f4f6',
            height: 3
          },
          '& .MuiSlider-valueLabel': {
            backgroundColor: '#4b5563',
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            '.Mui-active &': {
              backgroundColor: '#346ff3',
            }
          },
        }}
      />
    </div>
  );
} 