// import { NextResponse } from 'next/server';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const searchQuery = searchParams.get('query');

//   console.log('Received search query:', searchQuery);

//   const url = `https://avkhdvyjcweghosyfiiw.supabase.co/rest/v1/players?LastName=ilike.${encodeURIComponent(searchQuery || '')}&select=*`;

//   console.log('Supabase URL:', url);

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PLAYERS || '',
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PLAYERS || ''}`,
//       },
//     });

//     if (response.ok) {
//       const data = await response.text();
//       console.log('Raw response data:', data);

//       try {
//         const players = JSON.parse(data);
//         console.log('Parsed players data:', players);

//         if (Array.isArray(players)) {
//           return NextResponse.json(players);
//         } else {
//           console.error('Invalid response data format. Expected an array.');
//           return NextResponse.json({ message: 'Invalid response data format' }, { status: 500 });
//         }
//       } catch (parseError) {
//         console.error('Error parsing response data:', parseError);
//         return NextResponse.json({ message: 'Error parsing response data' }, { status: 500 });
//       }
//     } else {
//       const errorData = await response.text();
//       console.error('Error fetching player data:', response.status, response.statusText);
//       console.error('Error details:', errorData);

//       return NextResponse.json(
//         { message: 'Failed to fetch player data', error: response.statusText },
//         { status: response.status }
//       );
//     }
//   } catch (error) {
//     console.error('Error making request to Supabase:', error);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';

export async function GET(request: { url: string | URL; }) {
  const { searchParams } = new URL(request.url);
  const textSearch = searchParams.get('textSearch');
  const limit = searchParams.get('limit') || '10'; // Default to an empty string if not provided
  const state = searchParams.get('state') || ''; // Default to an empty string if not provided
  const searchQuery = searchParams.get('query');

  const url = `https://tpa.perfectgame.org/api/ScoutNotes/PlayerSearchV2?playerName=${encodeURIComponent(
    searchQuery || ''
  )}&limit=${encodeURIComponent(
    limit
  )}&state=${encodeURIComponent(
    state
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
