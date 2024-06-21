import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getCorsHeaders(origin: string | null) {
  // Check if the origin is from a perfectgame.org domain or subdomain
  const isValidOrigin = origin && /^https:\/\/([a-zA-Z0-9-]+\.)*perfectgame\.org$/.test(origin);

  return {
    'Access-Control-Allow-Origin': isValidOrigin ? origin : 'https://perfectgame.org',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle preflight request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers: corsHeaders });
  }

  const { searchParams } = new URL(request.url);
  const playerID = searchParams.get('playerID');

  if (!playerID) {
    return NextResponse.json(
      { message: 'Missing playerID parameter' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('player_id', playerID)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts from Supabase:', postsError);
      return NextResponse.json(
        { message: 'Failed to fetch posts from Supabase' },
        { status: 500, headers: corsHeaders }
      );
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

    return NextResponse.json(supabaseVideos, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Error making request:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { headers: getCorsHeaders(origin) });
}

function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
  const extension = url.slice(url.lastIndexOf('.')).toLowerCase();
  return videoExtensions.includes(extension);
}