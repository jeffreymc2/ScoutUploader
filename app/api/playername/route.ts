import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Specify edge runtime for better performance

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const textSearch = searchParams.get('textSearch');
  const limit = searchParams.get('limit') || '50';
  const state = searchParams.get('state') || '';
  const searchQuery = searchParams.get('query') || '';

  const url = `https://tpa.perfectgame.org/api/ScoutNotes/PlayerSearchV2?playerName=${encodeURIComponent(
    searchQuery || ''
  )}&limit=${encodeURIComponent(limit)}&state=${encodeURIComponent(state)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.TPA_AUTHORIZATION_HEADER || ''}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      next: { revalidate: 60 }, // Cache the response for 60 seconds
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
        },
      });
    } else {
      const errorData = await response.text();
      console.error('Error fetching data:', response.status, response.statusText);
      console.error('Error details:', errorData);
      return NextResponse.json(
        { message: 'Failed to fetch data', error: response.statusText },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error making request:', error);
    if ((error as Error).name === 'AbortError') {
      return NextResponse.json({ message: 'Request timed out' }, { status: 408 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}