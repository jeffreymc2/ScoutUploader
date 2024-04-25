// app/api/playerhighlights/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerID = searchParams.get('playerID');
  

  if (!playerID) {
    return NextResponse.json({ message: 'Missing playerID parameter' }, { status: 400 });
  }

  // Construct the URL for the external API request
  const url = `https://perfectgame.drund.com/~/highlights/${encodeURIComponent(playerID)}/?page=1&limit=10&type=h&version=v2&start_date=06-01-2023&end_date=04-16-2024&position=b`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Drund-Api-Key': `${process.env.DRUND_API_KEY}`,
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',  

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
