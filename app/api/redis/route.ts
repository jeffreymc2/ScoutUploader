import { NextResponse } from 'next/server';
import redis from 'redis';

// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

export async function POST(req: Request) {
  try {
    const { videoPath, user_id, player_id } = await req.json();

    // Construct the job data
    const jobData = {
      videoPath,
      user_id,
      player_id,
    };

    // Enqueue the job in Redis
    await redisClient.lPush('video-processing-queue', JSON.stringify(jobData));

    return NextResponse.json({ message: 'Video processing job enqueued' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to enqueue video processing job' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}