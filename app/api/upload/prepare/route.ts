
//app/api/upload/prepare/route.ts
import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST() {
  try {
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['public'],
      },
      cors_origin: '*',
    });

    // const uploadUrl = `https://api.mux.com/video/v1/assets/${upload.asset_id}`;

    return NextResponse

  } catch (error) {
    console.error('Error creating Mux upload:', error);
    return NextResponse.json({ error: 'Failed to create Mux upload' }, { status: 500 });
  }
}