import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DRUND_API_PATH = "https://perfectgame.drund.com/";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerID = searchParams.get("playerID");
  const page = searchParams.get("page") || "1";
  const type = searchParams.get("type") || "h";
  const limit = searchParams.get("limit") || "20";
  const position = searchParams.get("position");

  if (!playerID) {
    return NextResponse.json(
      { message: "Missing playerID parameter" },
      { status: 400 }
    );
  }

  try {
    let highlightsData = null;
    let nextUrl = `${DRUND_API_PATH}/~/highlights/${encodeURIComponent(
      playerID
    )}/?page=${page}&limit=${limit}&type=${type}&version=v2`;

    if (position) {
      nextUrl += `&position=${position}`;
    }

    while (nextUrl) {
      const highlightsResponse = await fetch(nextUrl, {
        method: "GET",
        headers: {
          "Drund-Api-Key": `${process.env.DRUND_API_KEY}`,
          Accept: "application/json",
        },
      });

      if (highlightsResponse.ok) {
        const data = await highlightsResponse.json();
        if (!highlightsData) {
          highlightsData = data;
        } else {
          highlightsData.results.push(...data.results);
        }
        nextUrl = data.next;
      } else {
        const errorData = await highlightsResponse.text();
        console.error(
          "Error fetching highlights:",
          highlightsResponse.status,
          highlightsResponse.statusText
        );
        console.error("Error details:", errorData);
        return NextResponse.json(
          {
            message: "Failed to fetch highlights from Drund API",
            error: errorData,
          },
          { status: highlightsResponse.status }
        );
      }
    }

    let combinedHighlights = highlightsData?.results || [];

    if (type === "h") {
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("player_id", playerID)
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error fetching posts from Supabase:", postsError);
        return NextResponse.json(
          { message: "Failed to fetch posts from Supabase" },
          { status: 500 }
        );
      }

      const supabaseVideos = posts
        ? posts
            .filter((post) => isVideoFile(post.file_url ?? ""))
            .map((post) => ({
              id: post.id,
              title: post.title || "",
              description: post.description || "",
              thumbnailUrl: post.thumbnail_url || "",
              url: post.file_url || "",
              created: post.created_at,
              highlight_type: "h",
            }))
        : [];

      combinedHighlights = [
        ...supabaseVideos,
        ...(highlightsData?.results || []).map((result: any) => ({
          id: result.id,
          stream_id: result.stream_id,
          title: result.title || "",
          description: result.description || "",
          start_time: result.start_time,
          end_time: result.end_time,
          duration: result.duration,
          thumbnailUrl: result.thumbnail || "",
          url: result.url || "",
          created: result.created,
          tagged_player_keys: result.tagged_player_keys,
          highlight_type: result.highlight_type,
          drund_event_id: result.drund_event_id,
          game_key: result.game_key,
          scoringapp_play_id: result.scoringapp_play_id,
          play_type: result.play_type,
          highlight_created: result.highlight_created,
        })),
        
      ];
    } else {
      combinedHighlights = [
        ...(highlightsData?.results || []).map((result: any) => ({
          id: result.id,
          stream_id: result.stream_id,
          title: result.title || "",
          description: result.description || "",
          start_time: result.start_time,
          end_time: result.end_time,
          duration: result.duration,
          thumbnailUrl: result.thumbnail || "",
          url: result.url || "",
          created: result.created,
          tagged_player_keys: result.tagged_player_keys,
          highlight_type: result.highlight_type,
          drund_event_id: result.drund_event_id,
          game_key: result.game_key,
          scoringapp_play_id: result.scoringapp_play_id,
          play_type: result.play_type,
          highlight_created: result.highlight_created,
        })),
      ];
    }

    return NextResponse.json(
      { highlights: combinedHighlights },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Origin,Access-Control-Request-Headers,Access-Control-Request-Method",
        },
      }
    );
  } catch (error) {
    console.error("Error making request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Origin,Access-Control-Request-Headers,Access-Control-Request-Method",
      },
    }
  );
}

function isVideoFile(url: string): boolean {
  const videoExtensions = [".mp4", ".mov", ".avi", ".wmv", ".flv", ".mkv"];
  const extension = url.slice(url.lastIndexOf(".")).toLowerCase();
  return videoExtensions.includes(extension);
}
