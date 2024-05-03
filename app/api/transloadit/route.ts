// pages/api/transloadit.js
import Transloadit from 'transloadit';
import { NextRequest, NextResponse } from 'next/server';

export default async function handler(request: NextRequest) {
  if (request.method === 'POST') {
    try {
      // Init
      const transloadit = new Transloadit({
        authKey: process.env.TRANSLOADIT_KEY ?? '',
        authSecret: process.env.TRANSLOADIT_API_SECRET ?? '',
      });

      // Set Encoding Instructions
      const options = {
        files: {
          myfile_1: 'https://ivs-cdn.drund.com/ivs/v1/060002717437/R4y7sg20wbOF/2023/7/23/15/39/Hu0l4JT9tYMM/media/hls/master.m3u8',
        },
        params: {
          steps: {
            ':original': { robot: '/upload/handle' },
            shortened: {
              use: ':original',
              robot: '/video/encode',
              result: true,
              ffmpeg_stack: 'v6.0.0',
              ffmpeg: { ss: '00:00:26.0', t: 10 },
              preset: 'ipad-high',
              turbo: true,
            },
            exported: {
              robot: '/s3/store',
              use: [':original', 'shortened'],
              bucket: 'misc',
              key: 'juq6byu3pme6dsole72sd63q2jjq',
              host: 'https://gateway.storjshare.io',
              no_vhost: true,
              secret: 'j3xjy33iqgrsszkkxhsfh5nzy6qkllvuwtpvwxlvzj3clbss2tfou',
              path: 'misc/4566677/${file.url_name}',
            },
          },
        },
      };

      // Execute
      const result = await transloadit.createAssembly(options);

      // Send response
      return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}