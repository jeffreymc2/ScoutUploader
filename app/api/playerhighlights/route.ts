import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerID = searchParams.get('playerID');

  if (!playerID) {
    return NextResponse.json({ message: 'Missing playerID parameter' }, { status: 400 });
  }

  try {
    // Fetch player highlights from the external API
    const highlightsUrl = `https://perfectgame.drund.com/~/highlights/${encodeURIComponent(playerID)}/?page=1&limit=20&type=h&version=v2&start_date=06-01-2023&end_date=04-16-2024&position=`;
    const highlightsResponse = await fetch(highlightsUrl, {
      method: 'GET',
      headers: {
        'Drund-Api-Key': `${process.env.DRUND_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    let highlightsData = null;
    if (highlightsResponse.ok) {
      highlightsData = await highlightsResponse.json();
    } else {
      const errorData = await highlightsResponse.text();
      console.error('Error fetching highlights:', highlightsResponse.status, highlightsResponse.statusText);
      console.error('Error details:', errorData);
    }

    // Fetch player videos from Supabase
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('player_id', playerID)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts from Supabase:', postsError);
      return NextResponse.json({ message: 'Failed to fetch posts from Supabase' }, { status: 500 });
    }

    const supabaseVideos = posts
      ? posts.filter((post) => isVideoFile(post.file_url ?? '')).map((post) => ({
          id: post.id,
          title: post.title || '',
          description: post.description || '',
          thumbnailUrl: post.thumbnail_url || '',
          url: post.file_url || '',
          created: post.created_at,
          is_video: true,
        }))
      : [];

    // Combine the highlights data and Supabase videos
    const combinedHighlights = [
      ...(highlightsData?.results || []).map((result: any) => ({
        id: result.id,
        stream_id: result.stream_id,
        title: result.title || '',
        description: result.description || '',
        start_time: result.start_time,
        end_time: result.end_time,
        duration: result.duration,
        thumbnailUrl: result.thumbnail || '',
        url: result.url || '',
        created: result.created,
        tagged_player_keys: result.tagged_player_keys,
        highlight_type: result.highlight_type,
        drund_event_id: result.drund_event_id,
        game_key: result.game_key,
        scoringapp_play_id: result.scoringapp_play_id,
        play_type: result.play_type,
        highlight_created: result.highlight_created,
      })),
      ...supabaseVideos,
    ];

    // Set CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://scouts.perfectgame.org',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Return the response with CORS headers
    return new NextResponse(JSON.stringify({ highlights: combinedHighlights }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Error making request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Helper function to check if a file is a video
function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
  const extension = url.slice(url.lastIndexOf('.')).toLowerCase();
  return videoExtensions.includes(extension);
}

// // app/api/playerhighlights/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const playerID = searchParams.get('playerID');
  

//   if (!playerID) {
//     return NextResponse.json({ message: 'Missing playerID parameter' }, { status: 400 });
//   }

//   // Construct the URL for the external API request
//   const url = `https://perfectgame.drund.com/~/highlights/${encodeURIComponent(playerID)}/?page=1&limit=10&type=h&version=v2&start_date=06-01-2023&end_date=04-16-2024&position=`;

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Drund-Api-Key': `${process.env.DRUND_API_KEY}`,
//         'Accept': 'application/json',
//         'Access-Control-Allow-Origin': '*',  

//       },
//     });

//     if (response.ok) {
//       const data = await response.json();
//       return NextResponse.json(data);
//     } else {
//       const errorData = await response.text();
//       console.error('Error fetching data:', response.status, response.statusText);
//       console.error('Error details:', errorData);
//       return NextResponse.json(
//         { message: 'Failed to fetch data', error: response.statusText },
//         { status: response.status }
//       );
//     }
//   } catch (error) {
//     console.error('Error making request:', error);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// }
