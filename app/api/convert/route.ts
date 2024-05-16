import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url, startTime, duration } = await req.json();

    console.log('Received request:', { url, startTime, duration });
    console.log('Environment variable:', process.env.TRANSLOADIT_API_KEY);

    const assemblyInstructions = {
      auth: { key: process.env.TRANSLOADIT_API_KEY },
      steps: {
        ':import': {
          robot: '/http/import',
          url,
        },
        ':clip': {
          use: ':import',
          robot: '/video/encode',
          ffmpeg_stack: 'v6.0.0',
          preset: 'ipad',
          duration,
          start_time: startTime,
          result: true,
        },
        ':convert_to_ipad': {
          use: ':clip',
          robot: '/video/encode',
          ffmpeg_stack: 'v6.0.0',
          preset: 'ipad',
          result: true,
        },
      },
    };

    const requestBody = {
      params: JSON.stringify(assemblyInstructions)
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api2.transloadit.com/assemblies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('Transloadit API response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Transloadit API error:', data);
      throw new Error(`Transloadit API error: ${data.error || response.statusText}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/transloadit:', error);
    return NextResponse.json({ error: 'Failed to create Transloadit Assembly' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'API route working' });
}
