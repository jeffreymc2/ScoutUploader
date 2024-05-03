// pages/index.js
"use client";
import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);

  const handleCreateAssembly = async () => {
    try {
      const response = await fetch('/api/transloadit', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  return (
    <div>
      <button onClick={handleCreateAssembly}>Create Assembly</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

// // // pages/transcode.tsx
// // "use client";
// // import { useState } from "react";

// // export default function TranscodePage() {
// //   const [isTranscoding, setIsTranscoding] = useState(false);
// //   const [transcodingResult, setTranscodingResult] = useState(null);

// //   const handleTranscode = async () => {
// //     setIsTranscoding(true);
// //     try {
// //       const response = await fetch("/api/transcode", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ url: "https://ivs-cdn.drund.com/ivs/v1/060002717437/R4y7sg20wbOF/2023/7/23/15/39/Hu0l4JT9tYMM/media/hls/master.m3u8" }),
// //       });
// //       const data = await response.json();
// //       setTranscodingResult(data);
// //     } catch (error) {
// //       console.error("Error initiating transcoding:", error);
// //     }
// //     setIsTranscoding(false);
// //   };

// //   return (
// //     <div>
// //       <h1>Transcoding Test</h1>
// //       <button onClick={handleTranscode} disabled={isTranscoding}>
// //         {isTranscoding ? "Transcoding..." : "Start Transcoding"}
// //       </button>
// //       {transcodingResult && (
// //         <div>
// //           <h2>Transcoding Result:</h2>
// //           <pre>{JSON.stringify(transcodingResult, null, 2)}</pre>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// // yarn add transloadit || npm i transloadit

// // Import
// import  Transloadit  from 'transloadit'
// // Init
// const transloadit = new Transloadit({
//   authKey: process.env.TRANSLOADIT_KEY ?? '',
//   authSecret: process.env.TRANSLOADIT_API_SECRET ?? '',
// })

// // Set Encoding Instructions
// const options = {
//   files: {
//     myfile_1: 'https://ivs-cdn.drund.com/ivs/v1/060002717437/R4y7sg20wbOF/2023/7/23/15/39/Hu0l4JT9tYMM/media/hls/master.m3u8',
//   },
//   params: {
//     steps: {
//       ':original': {
//         robot: '/upload/handle',
//       },
//       shortened: {
//         use: ':original',
//         robot: '/video/encode',
//         result: true,
//         ffmpeg_stack: 'v6.0.0',
//         ffmpeg: {
//           ss: '00:00:26.0',
//           t: 10,
//         },
//         preset: 'ipad-high',
//         turbo: true,
//       },
//       exported: {
//         robot: "/s3/store",
//         use: [
//           ":original",
//           "shortened",
//         ],
//         bucket: "misc",
//         key: "juq6byu3pme6dsole72sd63q2jjq",
//         host: "https://gateway.storjshare.io",
//         no_vhost: true,
//         secret: "j3xjy33iqgrsszkkxhsfh5nzy6qkllvuwtpvwxlvzj3clbss2tfou",
//         path: "misc/4566677/${file.url_name}"
//       }
//     },
//   },
// }

// // Execute
// transloadit.createAssembly(options)
//   .then((result) => {
//     // Show results
//     console.log({ result });
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });