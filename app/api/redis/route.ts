
import { NextResponse } from "next/server";
import { createClient } from "redis";

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function POST(request: Request) {
  const { videoPath, user_id, player_id, name } = await request.json();

  try {
    await redisClient.connect();
    const jobData = { videoPath, user_id, player_id, name };
    await redisClient.lPush("video-processing-queue", JSON.stringify(jobData));
    console.log("Video processing job enqueued");
    await redisClient.disconnect();

    return NextResponse.json({ message: "Video processing job enqueued" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to enqueue video processing job" },
      { status: 500 }
    );
  }
}


// import { NextResponse } from "next/server";
// import { createClient } from "redis";

// const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });

// redisClient.on("error", (err) => console.log("Redis Client Error", err));

// export async function POST(request: Request) {
//   const { videoPath, user_id, player_id, name } = await request.json();

//   try {
//     await redisClient.connect();

//     const jobData = {
//       videoPath,
//       user_id,
//       player_id,
//       name
//     };

//     await redisClient.lPush("video-processing-queue", JSON.stringify(jobData));
//     console.log("Video processing job enqueued");

//     await redisClient.disconnect();

//     return NextResponse.json({ message: "Video processing job enqueued" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Failed to enqueue video processing job" },
//       { status: 500 }
//     );
//   }
// }