import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOEKN_SECRET!,
});

export async function POST(request: NextRequest) {
  const supabase = supabaseServer();

  const { files } = await request.json();

  for (const file of files) {
    
      const upload = await mux.video.uploads.create({
        cors_origin: '*',
        new_asset_settings: { playback_policy: ['public'] },
      });

      await fetch(upload.url, {
        method: 'PUT',
        body: file,
      });

      const asset = await mux.video.assets.create({
        input: [{ url: upload.url }],
        playback_policy: ['public'],
      });

      await supabase.from('posts').insert({
        name: file?.name,
        post_type: file?.type,
        mux_asset_id: asset?.id,
        mux_playback_id: asset?.playback_ids?.[0]?.id,
      });
    } 

  return NextResponse.json({ message: 'Files uploaded successfully' });
}