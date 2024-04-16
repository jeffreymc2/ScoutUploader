import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export default async function handler(req: any, res: any) {
  if (!redisClient) {
    redisClient = createClient({
      url: 'rediss://red-cofcc98l6cac73cditpg:3d9S1DAsyWJlyaeXe3orkpLkAyljje8n@ohio-redis.render.com:6379',
    });
    await redisClient.connect();
  }

  if (req.method === 'POST') {
    const { videoPath, user_id, player_id } = req.body;

    const jobData = {
      videoPath,
      user_id,
      player_id,
    };

    await redisClient.lPush('video-processing-queue', JSON.stringify(jobData));
    res.status(200).json({ message: 'Video processing job enqueued' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}