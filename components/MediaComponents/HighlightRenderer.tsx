import React from "react";
import MediaRenderer from "./MediaRenderer";

interface TaggedPlayerKey {
  Key: number;
  Position: string;
}

interface Highlight {
  id: number;
  start_time: number;
  end_time: number;
  duration: number;
  thumbnail: string;
  created: string;
  tagged_player_keys: TaggedPlayerKey[];
  url: string;
  highlight_type: string;
  drund_event_id: number;
  game_key: string;
  scoringapp_play_id: number;
  play_type: string;
  highlight_created: string;
  title?: string;
  description?: string;
}

interface HighlightRendererProps {
  highlight: Highlight;
}

const HighlightRenderer: React.FC<HighlightRendererProps> = ({ highlight }) => {
  return (
    <MediaRenderer
      file={{
        id: `highlight-${highlight.id}`,
        created_at: highlight.created,
        image: highlight.url,
        isVideo: true,
        title: highlight.title,
        description: highlight.description,
        thumbnail: highlight.thumbnail,
        profile: null,
        compressed_video: highlight.url, // Pass the highlight URL as the compressed_video
        compressed_thumbnail: highlight.thumbnail, // Pass the highlight thumbnail as the compressed_thumbnail
      }}
      isHighlight={true}
    />
  );
};

export default HighlightRenderer;