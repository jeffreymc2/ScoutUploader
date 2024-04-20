// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const file = req.body;

    const upload = await mux.video.uploads.create({
        new_asset_settings: {
            playback_policy: ['public'],
        },
        cors_origin: '*',
    });

    await fetch(upload.url, {
        method: 'PUT',
        body: file,
    });

    if (upload.asset_id) {
        const asset = await mux.video.assets.retrieve(upload.asset_id);
        res.status(200).json({ data: asset });
    } else {
        res.status(500).json({ error: 'Asset ID is undefined' });
    }
    } catch (error) {
      console.error('Error uploading file to Mux:', error);
      res.status(500).json({ error: 'Error uploading file to Mux' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}