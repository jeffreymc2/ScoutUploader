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
    return createResponse({ message: 'Missing playerID parameter' }, 400);
  }

  try {
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('player_id', playerID)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts from Supabase:', postsError);
      return createResponse({ message: 'Failed to fetch posts from Supabase' }, 500);
    }

    const supabaseVideos = posts
      ? posts.filter((post) => isVideoFile(post.file_url ?? '')).map((post) => ({
          id: post.id,
          title: post.title || '',
          description: post.description || '',
          thumbnailUrl: post.thumbnail_url || '',
          url: post.file_url || '',
          created: post.created_at,
          highlight_type: "h", // Assuming all Supabase videos are highlights
        }))
      : [];

    return createResponse(supabaseVideos, 200);
  } catch (error) {
    console.error('Error making request:', error);
    return createResponse({ message: 'Internal Server Error' }, 500);
  }
}

export function OPTIONS() {
  return createResponse({}, 200);
}

function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
  const extension = url.slice(url.lastIndexOf('.')).toLowerCase();
  return videoExtensions.includes(extension);
}

function createResponse(body: any, status: number): NextResponse {
  const response = NextResponse.json(body, { status });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}