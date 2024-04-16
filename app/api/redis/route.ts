import type { NextApiRequest, NextApiResponse } from 'next';
import redis from 'redis';

// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { videoPath, user_id, player_id } = req.body;

    // Construct the job data
    const jobData = {
      videoPath,
      user_id,
      player_id,
    };

    // Enqueue the job in Redis
    await redisClient.lPush('video-processing-queue', JSON.stringify(jobData));

    res.status(200).json({ message: 'Video processing job enqueued' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}