// pages/api/blive.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerID = searchParams.get('playerID');

  if (!playerID) {
    return NextResponse.json({ message: 'Missing playerID parameter' }, { status: 400 });
  }

  const url = `https://dcm.perfectgame.tv/dcm/campaign/9000/topics/playerid-${encodeURIComponent(playerID)}`;

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

      if (data.success === 1) {
        const videos = data.data.map((video: any) => ({
          id: video.id,
          url: `https://${video.active_playlist_url}`, // Prepend https:// to the URL
          title: video.label,
          description: video.description,
          thumbnailUrl: video.poster_thumbnail_url,
          duration: parseInt(video.duration, 10),
          created: video.published_timestamp,
        }));

        return NextResponse.json(videos);
      } else {
        return NextResponse.json({ message: 'Error fetching data from BLive API' }, { status: 500 });
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
