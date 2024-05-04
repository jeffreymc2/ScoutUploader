// import { NextRequest, NextResponse } from 'next/server';


// // pages/api/consolidated.js
// export default async function handler(req, res) {
//     const { method } = req;
  
//     if (method === 'GET') {
//       try {
//         const playerRequest = new Request('https://api.example.com/player', {
//           headers: {
//             Authorization: 'Bearer player_token',
//             // Add any other headers specific to the player endpoint
//           },
//         });
  
//         const gameRequest = new Request('https://api.example.com/game', {
//           headers: {
//             Authorization: 'Bearer game_token',
//             // Add any other headers specific to the game endpoint
//           },
//         });
  
//         const highlightsRequest = new Request('https://api.example.com/highlights', {
//           headers: {
//             Authorization: 'Bearer highlights_token',
//             // Add any other headers specific to the highlights endpoint
//           },
//         });
  
//         const [playerResponse, gameResponse, highlightsResponse] = await Promise.all([
//           fetch(playerRequest),
//           fetch(gameRequest),
//           fetch(highlightsRequest),
//         ]);
  
//         const playerData = await playerResponse.json();
//         const gameData = await gameResponse.json();
//         const highlightsData = await highlightsResponse.json();
  
//         const consolidatedData = {
//           player: playerData,
//           game: gameData,
//           highlights: highlightsData,
//         };
  
//         return NextResponse.json(consolidatedData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//       }
//     } else {
//       return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
//     }
//   }