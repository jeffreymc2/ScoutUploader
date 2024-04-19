import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const supabase = supabaseServer();

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!, // This is the default and can be omitted
    tokenSecret: process.env.MUX_TOEKN_SECRET!, // This is the default and can be omitted
  });

  export async function POST(request: Request) {
  const { files } = await request.json();

  for (const file of files) {
    if (file.type.startsWith('video/')) {
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

    await supabase.from('posts')
    .insert({
        name: file.name,
        post_type: file.type,
        mux_asset_id: asset.id,
        mux_playback_id: asset.playback_ids?.[0]?.id,
    });
    } else {
      await supabase.from('posts')
      .insert({
        name: file.name,
        post_type: file.type,
      });
    }
  }

  return NextResponse.json({ message: 'Files uploaded successfully' });
}