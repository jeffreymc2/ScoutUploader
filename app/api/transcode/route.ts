

// import { Livepeer } from "livepeer";
// import { NextRequest, NextResponse } from 'next/server';


// function serialize(obj: any): string {
//   const seen = new WeakSet();

//   return JSON.stringify(obj, (key, value) => {
//     if (typeof value === "object" && value !== null) {
//       if (seen.has(value)) {
//         return;
//       }
//       seen.add(value);
//     }
//     return value;
//   });
// }



// export async function POST(req: NextRequest) {
//   try {
//     const livepeer = new Livepeer({
//       apiKey: process.env.LIVEPEER_API_KEY as string,
//     });

//     const transcodingResult = await livepeer.transcode.create({
//       input: {
//         url: "https://ivs-cdn.drund.com/ivs/v1/060002717437/R4y7sg20wbOF/2023/7/23/15/39/Hu0l4JT9tYMM/media/hls/master.m3u8",
//       },
//       storage: {
//         type: "s3",
//         endpoint: "https://gateway.storjshare.io",
//         credentials: {
//           accessKeyId: process.env.STORJ_ACCESS_KEY_ID as string,
//           secretAccessKey: process.env.STORJ_SECRET_ACCESS_KEY as string,
//         },
//         bucket: "testbuck",
//       },
//       outputs: {
//         hls: {
//           path: "/drund/hls",
//         },
//         mp4: {
//           path: "/drund/mp4",
//         },
//       },
//       profiles: [
//         {
//           name: "480p",
//           bitrate: 1000000,
//           fps: 30,
//           width: 854,
//           height: 480,
//         },
//         {
//           name: "360p",
//           bitrate: 500000,
//           fps: 30,
//           width: 640,
//           height: 360,
//         },
//       ],
//     });
//     console.log('Transcoding Result:', transcodingResult);

//     const serializedResult = serialize(transcodingResult);

//     return NextResponse.json({
//       message: "Transcoding initiated successfully",
//       result: serializedResult,
//     });
//   } catch (error: any) {
//     console.error("Error initiating transcoding:", error);
//     return NextResponse.json(
//       {
//         message: "Error initiating transcoding",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }