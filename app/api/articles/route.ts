import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { supabaseServer } from '@/lib/supabase/server';
import { GameData, Article, PlayerGameProfile } from '@/lib/types/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI key
});


export async function POST(req: NextRequest) {
  try {
    const { gameId } = await req.json();

    // Fetch game data from the API
    const gameData: GameData[] = await fetchGameData(gameId);

    // Generate the article using OpenAI
    const articleContentWithLinks = await generateArticle(gameData);

    // Extract player mentions from the article content
    const playersMentioned = extractPlayerMentions(articleContentWithLinks, gameData);

    // Store the article in Supabase
    const { data, error } = await supabaseServer()
      .from('articles')
      .insert({
        content: articleContentWithLinks,
        player_mentions: JSON.stringify(playersMentioned),
      })
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ article: data });
  } catch (error) {
    console.error('Error generating article:', error);
    return NextResponse.json({ error: 'Failed to generate article' }, { status: 500 });
  }
}

async function fetchGameData(gameId: string): Promise<GameData[]> {
  const response = await fetch(`https://tpa.perfectgame.org/api/Scoring/getplays?gamekey=${gameId}`, {
    headers: {
      Authorization: `Bearer ${process.env.PG_API_KEY!}`,
      'Cache-Control': 'no-cache',
      'Cookie': process.env.PG_COOKIE!,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch game data');
  }

  const data = await response.json();
  return data;
}

async function generateArticle(gameData: GameData[]): Promise<string> {
  const prompt = `
    You are a skilled sports writer who was a former baseball scout tasked with creating captivating articles that summarize youth baseball games from both a sports writers perspective, but also a baseball scouting perspective based on the following game data:

    Each article should adhere to the following structure:

    Provide a concise, factual summary of the game, including the final score and a general description of the game's nature (e.g., closely contested, defensive battle, high-scoring affair).

    Identify and describe the top performances from each team, focusing on 5-7 players.

    Include specific statistics for each highlighted player, such as runs, hits, RBIs, strikeouts, etc.

    Mention any significant plays or contributions that had a noticeable impact on the game's outcome.

    Detail 2-3 crucial or exciting moments in the game. These could include key hits, strategic plays, or turning points that influenced the game's direction.

    Use a descriptive, play-by-play style to bring these moments to life for the reader, incorporating player actions, reactions, and crowd atmosphere.

    Briefly mention any relevant background information that adds depth to the story.

    Maintain an enthusiastic yet factual tone throughout the article. You will be writing thousands of these articles so be sure to not use the same opening lines each time.

    Avoid hyperbolic descriptions like thrilling, exhilarating, electrifying, gripping, etc, ; keep the narrative grounded in actual events and accurate statistics based on the data feed provided.

    Ensure the writing is accessible and engaging for sports fans, reflecting the excitement and dynamics of the game.

    Don't refer to baseball game as a match. Be sure to use baseball terms only, not terms used in other sports.

    Each article should be approximately 5-7 paragraphs long, aiming for a balance between detail and conciseness.

    Write it as if it were to be published, so avoid the paragraph sections. Do not mention details you are unsure of such as weather, etc.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: "system", content: prompt }, { role: "assistant", content:  `${JSON.stringify(gameData, null, 2)}`
  }],
  temperature: 0.45,
  max_tokens: 662,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  });

  const result = response.choices[0].message.content;

  // Extract player mentions from the generated article content
  const playersMentioned = result ? extractPlayerMentions(result, gameData) : [];

  // Create a map of player names to their Perfect Game profile URLs
  const playerLinkMap = new Map<string, string>();
  playersMentioned.forEach((player) => {
    if (player.Name && player.PlayerID) {
      const profileUrl = `https://www.perfectgame.org/Players/Playerprofile.aspx?ID=${player.PlayerID}`;
      playerLinkMap.set(player.Name, profileUrl);
    }
  });

  // Replace player names with links in the article content
  const articleContentWithLinks = result?.replace(/\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g, (match, playerName) => {
    const profileUrl = playerLinkMap.get(playerName);
    if (profileUrl) {
      return `<a href="${profileUrl}" target="_blank">${playerName}</a>`;
    }
    return playerName;
  }) ?? '';

  return articleContentWithLinks;
}

function extractPlayerMentions(articleContent: string, gameData: GameData[]): PlayerGameProfile[] {
  const playerNames = gameData.flatMap((data) => [data.Batter.Name, data.Pitcher.Name]);
  const uniquePlayerNames = [...new Set(playerNames)];

  const playersMentioned: PlayerGameProfile[] = [];

  uniquePlayerNames.forEach((playerName) => {
    if (articleContent && playerName && articleContent.includes(playerName as string)) {
      const playerData = gameData.find((data) => data.Batter.Name === playerName || data.Pitcher.Name === playerName);
      if (playerData) {
        const player: PlayerGameProfile = {
          PlayerID: playerData.Batter.PlayerID || playerData.Pitcher.PlayerID,
          Name: playerName,
          CollegeCommit: playerData.Batter.CollegeCommit || playerData.Pitcher.CollegeCommit,
          City: playerData.Batter.City || playerData.Pitcher.City,
          State: playerData.Batter.State || playerData.Pitcher.State,
          Height: playerData.Batter.Height || playerData.Pitcher.Height,
          Weight: playerData.Batter.Weight || playerData.Pitcher.Weight,
          id: null,
        };
        playersMentioned.push(player);
      }
    }
  });

  return playersMentioned;
}