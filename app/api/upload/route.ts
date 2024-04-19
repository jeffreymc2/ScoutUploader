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

  console.log('Received files:', files);

  const uploadPromises = files.map(async (file: any) => {
    if (file.type.startsWith('video/')) {
      console.log('Processing video file:', file.name);

      const upload = await mux.video.uploads.create({
        new_asset_settings: {
          playback_policy: ['public'],
          encoding_tier: 'baseline',
        },
        cors_origin: '*',
      });

      console.log('Created Mux upload:', upload);

      await fetch(upload.url, {
        method: 'PUT',
        body: file,
      });

      console.log('Uploaded file to Mux');

      const asset = await mux.video.assets.retrieve(upload.asset_id!);

      console.log('Retrieved Mux asset:', asset);

      await supabase.from('posts').insert({
        name: file?.name,
        post_type: file?.type,
        mux_asset_id: asset?.id,
        mux_playback_id: asset?.playback_ids?.[0]?.id,
      });

      console.log('Inserted file details into Supabase');

      return asset;
    } else {
      console.log('Processing non-video file:', file.name);

      await supabase.from('posts').insert({
        name: file?.name,
        post_type: file?.type,
      });

      console.log('Inserted file details into Supabase');
    }
  });

  const assets = await Promise.all(uploadPromises);

  console.log('All uploads completed');

  return NextResponse.json({ message: 'Files uploaded successfully', assets });
}