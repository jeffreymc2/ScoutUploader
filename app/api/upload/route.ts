import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOEKN_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');

    const supabase = supabaseServer();
    const { files } = await request.json();

    console.log('Received files:', files);

    const uploadPromises = files.map(async (file: any) => {
      if (file.type.startsWith('video/')) {
        console.log('Processing video file:', file.name);

        try {
          const uploadResponse = await mux.video.uploads.create({
            new_asset_settings: {
              playback_policy: ['public'],
              encoding_tier: 'baseline',
            },
            cors_origin: '*',
          });

          console.log('Created Mux upload:', uploadResponse);

          const uploadUrl = uploadResponse.url;
          console.log('Mux upload URL:', uploadUrl);

          const fetchResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
          });

          console.log('File upload response:', fetchResponse);

          if (!fetchResponse.ok) {
            throw new Error(`Failed to upload file to Mux: ${fetchResponse.statusText}`);
          }

          const assetId = uploadResponse.asset_id!;
          console.log('Mux asset ID:', assetId);

          const assetResponse = await mux.video.assets.retrieve(assetId);
          console.log('Retrieved Mux asset:', assetResponse);

          const { error: supabaseError } = await supabase.from('posts').insert({
            name: file?.name,
            post_type: file?.type,
            mux_asset_id: assetResponse?.id,
            mux_playback_id: assetResponse?.playback_ids?.[0]?.id,
          });

          if (supabaseError) {
            console.error('Error inserting file details into Supabase:', supabaseError);
            throw supabaseError;
          }

          console.log('Inserted file details into Supabase');

          return assetResponse;
        } catch (error) {
          console.error('Error processing video file:', error);
          throw error;
        }
      } else {
        console.log('Processing non-video file:', file.name);

        const { error: supabaseError } = await supabase.from('posts').insert({
          name: file?.name,
          post_type: file?.type,
        });

        if (supabaseError) {
          console.error('Error inserting file details into Supabase:', supabaseError);
          throw supabaseError;
        }

        console.log('Inserted file details into Supabase');
      }
    });

    const assets = await Promise.all(uploadPromises);

    console.log('All uploads completed');

    return NextResponse.json({ message: 'Files uploaded successfully', assets });
  } catch (error) {
    console.error('Error in file upload:', error);
    return NextResponse.json({ error: 'An error occurred during file upload' }, { status: 500 });
  }
}