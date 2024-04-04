//app/api/eventsearch/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const textSearch = searchParams.get('textSearch');
  const limit = searchParams.get('limit') || '10';
  const state = searchParams.get('state') || '';
  const searchQuery = searchParams.get('query');
  const eventId = searchParams.get('eventId');

  let url = '';

  if (eventId) {
    // Fetch tournament teams for the specific event
    url = `https://tpa.perfectgame.org/api/ScoutNotes/EventSearch?eventId=${encodeURIComponent(eventId)}`;
  } else {
    // Fetch events based on the search query
    url = `https://tpa.perfectgame.org/api/ScoutNotes/EventSearch?eventSearchTerm=${encodeURIComponent(
      searchQuery || ''
    )}&eventState=${encodeURIComponent(state)}`;
  }

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
      console.error('Error fetching data:', response.status, response.statusText);
      return NextResponse.json({ message: 'Failed to fetch data' }, { status: response.status });
    }
  } catch (error) {
    console.error('Error making request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}