import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=inspiration`;
    
    const response = await fetch(url);
    const text = await response.text();
    
    // Parse CSV, skipping the header row
    const quotes = text
      .split('\n')
      .slice(1) // Skip header row
      .map(row => row.trim().replace(/^"|"$/g, '')) // Remove quotes
      .filter(Boolean); // Remove empty rows
    
    // Get a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)] || 'Keep pushing forward!';

    return NextResponse.json({ quote: randomQuote });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
} 