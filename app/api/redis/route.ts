import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { videoPath, user_id, player_id } = req.body;

    try {
      await redisClient.connect();

      const jobData = {
        videoPath,
        user_id,
        player_id,
      };

      await redisClient.lPush("video-processing-queue", JSON.stringify(jobData));
      console.log("Video processing job enqueued");

      await redisClient.disconnect();

      res.status(200).json({ message: "Video processing job enqueued" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to enqueue video processing job" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}