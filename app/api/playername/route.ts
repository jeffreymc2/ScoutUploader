import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const textSearch = searchParams.get('textSearch');
  const limit = searchParams.get('limit') || '200'; // Provides a default value if not provided
  const state = searchParams.get('state') || ''; // Provides a default value if not provided
  const searchQuery = searchParams.get('query');

  // Construct the URL for the external API request
  const url = `https://tpa.perfectgame.org/api/ScoutNotes/PlayerSearchV2?playerName=${encodeURIComponent(
    searchQuery || ''
  )}&limit=${encodeURIComponent(limit)}&state=${encodeURIComponent(state)}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.TPA_AUTHORIZATION_HEADER || ''}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
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
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}