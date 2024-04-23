//app/api/playerhighlights/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerID = searchParams.get('playerID');

  

  if (!playerID) {
    return NextResponse.json({ message: 'Missing playerID parameter' }, { status: 400 });
  }

  const url = `https://tpa.perfectgame.org/api/DiamondKastPlusVideoPlayer/GetPlayerHighlightsClipsFromDrundAPIv2DataFeed?playerId=${encodeURIComponent(playerID)}&type=h`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'securityToken': 'CIRCLE-CIRCLE-CIRCLE-CIRCLE-CIRCLE-CIRCLE-R1-L2-L1-TRIANGLE-CIRCLE-TRIANGLE',
        'Cookie': 'ARRAffinity=02f71ca019ee10e62194cd2e4fc6d9375f916bdd8c894f428d08b2f66a552f4f; ARRAffinitySameSite=02f71ca019ee10e62194cd2e4fc6d9375f916bdd8c894f428d08b2f66a552f4f',
      },
      
    });

    

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const errorData = await response.text();
      
      console.error('Error fetching data:', response.status, response.statusText);
      console.error('Error details:', errorData);
      
      return NextResponse.json({ message: 'Failed to fetch data', error: response.statusText }, { status: response.status });
     
    }
    
  } catch (error) {
    console.error('Error making request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}