import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerID = searchParams.get('playerID');

  if (!playerID) {
    const response = NextResponse.json({ message: 'Missing playerID parameter' }, { status: 400 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  }

  try {
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('player_id', playerID)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts from Supabase:', postsError);
      const response = NextResponse.json({ message: 'Failed to fetch posts from Supabase' }, { status: 500 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return response;
    }

    const supabaseVideos = posts
      ? posts.filter((post) => isVideoFile(post.file_url ?? '')).map((post) => ({
          id: post.id,
          title: post.title || '',
          description: post.description || '',
          thumbnailUrl: post.thumbnail_url || '',
          url: post.file_url || '',
          created: post.created_at,
          highlight_type: "", // Add the missing property 'highlight_type'
        }))
      : [];

    const response = NextResponse.json(supabaseVideos, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error making request:', error);
    const response = NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  }
}

export function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
  const extension = url.slice(url.lastIndexOf('.')).toLowerCase();
  return videoExtensions.includes(extension);
}
