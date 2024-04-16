import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export const POST = async (req: Request) => {
  if (!redisClient) {
    redisClient = createClient({
      url: 'rediss://red-cofcc98l6cac73cditpg:3d9S1DAsyWJlyaeXe3orkpLkAyljje8n@ohio-redis.render.com:6379',
    });
    await redisClient.connect();
  }

  const { videoPath, user_id, player_id } = await req.json();
  const jobData = { videoPath, user_id, player_id };
  await redisClient.lPush('video-processing-queue', JSON.stringify(jobData));

  return new Response(JSON.stringify({ message: 'Video processing job enqueued' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const GET = async (req: Request) => {
  return new Response(JSON.stringify({ message: 'Method not allowed' }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};