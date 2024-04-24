//app/api/events/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('query');


  // Construct the URL for the external API request
  const url = `https://tpa.perfectgame.org/api/ScoutNotes/EventTeams?eventID=${encodeURIComponent(
    eventId || ''
  )}`;

  
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.TPA_AUTHORIZATION_HEADER || ''}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.text();

      try {
        const result = JSON.parse(data);
        return NextResponse.json(result);
      } catch (parseError) {
        console.error('Error parsing response data:', parseError);
        return NextResponse.json({ message: 'Error parsing response data' }, { status: 500 });
      }
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
