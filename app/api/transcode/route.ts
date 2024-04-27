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



import { NextRequest, NextResponse } from 'next/server';
const Coconut = require('coconutjs')
const coconut = new Coconut.Client(`${process.env.COCONUT_API_KEY}`)

// coconut.notification = {
//   'type': 'http',
//   'url': 'https://yoursite/api/coconut/webhook'
// }


function serialize(obj: any): string {
    const seen = new WeakSet();
  
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    });
  }
  
  
coconut.storage = {
    service: "s3other",
    bucket: "testbuck",
    credentials: {
      access_key_id: `${process.env.STORJ_ACCESS_KEY_ID as string}`,
      secret_access_key: `${process.env.STORJ_SECRET_ACCESS_KEY as string}`
    },
    endpoint: "https://gateway.storjshare.io"
}


export async function POST(req: NextRequest) {
  
    const job = await coconut.Job.create({
        input: { 'url': 'https://ivs-cdn.drund.com/ivs/v1/060002717437/R4y7sg20wbOF/2023/7/23/15/39/Hu0l4JT9tYMM/media/hls/master.m3u8' },
        outputs: {
            webp: [
            {
              key: 'webp:cover',
              path: '/cover_%05d.webp',
              number: 10,
              format: {
                resolution: '600x'
              }
            },
            {
              key: 'webp:thumbs',
              path: '/thumbs_%05d.webp',
              interval: 10,
              format: {
                resolution: '200x'
              },
              sprite: {
                limit: 100,
                columns: 10
              },
              vtt: {
                  filename: 'thumbs.vtt'
               }
            },
          ],
          mp4: [
            {
              key: 'mp4',
                path: '/video.mp4',
              format: {
                quality: 4
              }
            }
           ],
           httpstream: {
             hls: { 'path': 'hls/' }
            }
         }
      })
      

    try {
    console.log('Transcoding Result:', job);

    const serializedResult = serialize(job);

    return NextResponse.json({
      message: "Transcoding initiated successfully",
      result: serializedResult,
    });
  } catch (error: any) {
    console.error("Error initiating transcoding:", error);
    return NextResponse.json(
      {
        message: "Error initiating transcoding",
        error: error.message,
      },
      { status: 500 }
    );
  }
}



