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
    return NextResponse.json({ message: 'Missing playerID parameter' }, { status: 400 });
  }

  try {
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
          highlight_type: "", // Add the missing property 'highlight_type'
        }))
      : [];

    return NextResponse.json( supabaseVideos, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error making request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
  const extension = url.slice(url.lastIndexOf('.')).toLowerCase();
  return videoExtensions.includes(extension);
}

