import { NextResponse } from 'next/server';
import { fetchAllData } from '@/utils/sheets';

export async function GET() {
  try {
    const data = await fetchAllData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
} 