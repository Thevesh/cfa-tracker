import { ProgressData, ChartData } from '@/types';

async function fetchSheetByName(sheetName: string): Promise<ProgressData[]> {
  const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
  
  const response = await fetch(url);
  const text = await response.text();
  
  // Parse CSV, skipping the header row
  const rows = text
    .split('\n')
    .slice(1) // Skip header row
    .map(row => {
      // Handle CSV parsing (accounting for quoted strings)
      const cells = row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')); // Remove quotes
      const [date, , actual, target] = cells; // Skip the 'day' column
      
      return {
        date,
        actual: Number(actual) || 0,
        target: Number(target) || 0
      };
    })
    .filter(row => row.date); // Filter out empty rows

  return rows;
}

function processData(rawData: ProgressData[]): ChartData {
  const sorted = [...rawData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return {
    labels: sorted.map(d => d.date),
    actual: sorted.map(d => d.actual),
    target: sorted.map(d => d.target),
  };
}

export async function fetchAllData() {
  try {
    const [dailyData, cumulativeData] = await Promise.all([
      fetchSheetByName('daily'),
      fetchSheetByName('cumulative')
    ]);

    return {
      daily: processData(dailyData),
      cumulative: processData(cumulativeData)
    };
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
} 