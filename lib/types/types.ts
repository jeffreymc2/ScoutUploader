// app/lib/types/types.ts

export interface Player {
  CollegeCommit: any;
  City: any;
  State: any;
  Height: any;
  PlayerName: any;
  playerid: number;
  playereventid: number;
  FirstName: string;
  LastName: string;
  FullName: string;
  bats: string;
  throws: string;
  BatsThrows: string;
  city: string;
  state: string;
  CityState: string;
  primarypos: string;
  OtherPos: string | null;
  height: string;
  Weight: number;
  Rank: string;
  tournamentteamname: string;
  TournamentTeamID: number;
  jerseynumber: string;
  ProfilePic: string | null;
}

export interface PlayerData {
  PlayerID: number;
  PlayerName: string;
  GradYear: string;
  CityState: string;
  Height: string;
  Weight: number;
  BatsThrows: string;
  PrimaryPos: string;
  Commitment: string | null;
  BestRankSort: number | null;
  bestPGGrade: number | null;
  NationalRank: number | null;
  NationalPosRank: number | null;
  StateRank: number | null;
  StatePosRank: number | null;
  Note: string | null;
  HighSchool: string;
  LastTeamPlayedFor: string | null;
  Age: string;
  ProfilePic: string | null;
}

// Add the PlayerResponse interface
export interface PlayerResponse {
  PlayerID: number;
  FirstName: string;
  LastName: string;
  PlayerName: string;
  DOB: string;
  BatsThrows: string;
  PrimaryPos: string;
  CommittedTo: string;
  GraduationYear: string;
  ProfileURL: string;
  FullName: string;
  // Add other relevant fields as needed
}

export interface BoxScoreStats {
  [key: string]: number | string;
}

export interface BoxScoreTeam {
  name: string;
  stats: BoxScoreStats;
}

export interface BoxScoreData {
  [key: string]: BoxScoreTeam;
}

// types.ts
export interface BaseRunner {
  playerId: string;
  basePosition: "first" | "second" | "third";
}

export interface Pitch {
  pitchNumber: number;
  pitchResult: "ball" | "strike" | "foul" | "hit";
  pitchType: string;
  pitchVelocity?: number;
}

export interface AtBat {
  batter: {
    playerId: string;
    handedness: "left" | "right";
    playerNumber: string; // Added playerNumber property
  };
  pitches: Pitch[];
  playResult:
    | "single"
    | "double"
    | "triple"
    | "homerun"
    | "out"
    | "walk"
    | "hitByPitch"
    | "error"
    | "sacrifice"
    | "stolenBase"
    | "fieldersChoice"
    | "balk"
    | "wildPitch"
    | "incomplete"; // Added 'incomplete' option
  playDescription: string;
  baseRunners?: BaseRunner[];
  rbi?: number;
  runScored?: boolean;
  fieldersInvolved?: string[];
}

export interface PlayData {
  inning: number;
  teamAtBat: string;
  pitcher: {
    playerId: string;
    team: string;
  };
  atBats: AtBat[];
  teamPitching: string;
}

export interface GameData {
  EventName: string;
  VisitorTeamName: string;
  HomeTeamName: string;
  Inning: number;
  InningHalf: number;
  Balls: number | null;
  Strikes: number | null;
  Outs: number | null;
  FirstBaseOccupied: boolean;
  SecondBaseOccupied: boolean;
  ThirdBaseOccupied: boolean;
  PitchSpeed: number | null;
  PitchType: string | null;
  Batter: {
    PlayerID: number | null;
    Name: string | null;
    CollegeCommit: string | null;
    City: string | null;
    State: string | null;
    Height: string | null;
    Weight: number | null;
  };
  BatterStats: any | null;
  Pitcher: {
    PlayerID: number | null;
    Name: string | null;
    CollegeCommit: string | null;
    City: string | null;
    State: string | null;
    Height: string | null;
    Weight: number | null;
  };
  PitcherStats: any | null;
}

export interface Article {
  id: number;
  content: string | null;
  description: string | null;
  image: Buffer | null;
  image_meta: string | null;
  image_url: string | null;
  keyword: string | null;
  title: string | null;
  creator_id: string | null;
  modified_date: string | null;
  created_date: string;
  slug: string | null;
  player_mentions: PlayerGameProfile[] | null;
}

export interface PlayerGameProfile {
  PlayerID: number | null;
  Name: string | null;
  CollegeCommit: string | null;
  City: string | null;
  State: string | null;
  Height: string | null;
  Weight: number | null;
  id: string | null;
}

export interface Post {
  MediaFileURL: string;
  id?: string;
  created_at: string;
  player_id?: string | null;
  name?: string;
  object_id?: string;
  post_by?: string;
  event_id?: string;
  team_id?: string;
  profile: {
    display_name: string | null;
  } | null;
  image: string;
  isVideo: boolean;
  post_type?: string;
  title?: string;
  publish_media?: boolean;
  description?: string;
  featured_image?: boolean;
  thumbnail_url?: string;
  file_url?: string;
  is_video?: boolean;
  compressed_gif?: string;
  compressed_thumbnail?: string;
  mux_asset_id?: string | null;
  mux_playback_id?: string | null;
  isHighlight?: boolean;
}

export interface EventData {
  EventID: string;
  EventName: string;
  // Add other relevant event fields
}

export interface TeamData {
  TeamID: string;
  TeamName: string;
  Roster: Player[];

  // Add other relevant team fields
}

export interface Team {
  TournamentTeamID: number;
  TournamentTeamName: string;
  SeasonYear: number;
  City: string;
  State: string;
  Classification: string | null;
  Wins: number;
  Losses: number;
  Ties: number;
  CoachFirstName: string;
  CoachLastName: string;
  CoachEmail: string;
  CoachMobile: string;
  Roster: Player[];
  TeamLogo: string;
}

export type TeamRoster = {
  TournamentTeamID: number;
  TournamentTeamName: string;
  SeasonYear: number;
  City: string;
  State: string;
  Classification: string | null;
  Wins: number;
  Losses: number;
  Ties: number;
  CoachFirstName: string;
  CoachLastName: string;
  CoachEmail: string;
  CoachMobile: string;
  Roster: Player[];
  TeamLogo: string;
};

export interface EventSearch {
  EventID: number;
  EventName: string;
  StartDate: string;
  EndDate: string; // ISO 8601 format date-time string
  DivisionID: number;
  Division: string;
  City: string;
  State: string;
  EventLogoURL: string;
  TeamCount: number;
}

export interface LiveEventSearch {
  EventID: number;
  EventName: string;
  StartDate: string;
  EndDate: string; // ISO 8601 format date-time string
  DivisionID: number;
  Division: string;
  EventLogoURL: string;
}

// types.ts

export interface Player {
  PlayerID: number;
  Name: string;
  GradYear: string;
  CityState: string;
  Weight: number;
  BatsThrows: string;
  PrimaryPos: string;
  Commitment: string | null;
  BestRankSort: number | null;
  bestPGGrade: number | null;
  NationalRank: number | null;
  NationalPosRank: number | null;
  StateRank: number | null;
  StatePosRank: number | null;
  Note: string | null;
  HighSchool: string;
  LastTeamPlayedFor: string | null;
  Age: string;
  ProfilePic: string | null;
  height: string;
}

export interface GameData {
  GameID: string;
  // Add other relevant game fields
}

export interface MediaFile {
  id: string | number;
  title?: string;
  description?: string;
  thumbnail?: string;
  url?: string;
  created_at: string;
  player_id?: string | null;
  name?: string;
  object_id?: string;
  post_by?: string;
  event_id?: string;
  team_id?: string;
  profile: {
    display_name: string | null;
  } | null;
  image: string;
  isVideo: boolean;
  post_type?: string;
  is_video?: boolean;
  featured_image?: boolean;
  thumbnail_url?: string;
  file_url?: string;
  compressed_gif?: string;
  compressed_thumbnail?: string;
  mux_asset_id?: string | null;
  mux_playback_id?: string | null;
  isHighlight?: boolean;
}

// lib/types/types.ts

export type HighlightVideo = {
  videoUrl: string | undefined;
  id: string;
  stream_id: string;
  title: string;
  description: string;
  start_time: number;
  end_time: number;
  duration: number;
  thumbnailUrl: string;
  url: string;
  created: string;
  tagged_player_keys: string[];
  highlight_type: string;
  drund_event_id: string;
  game_key: string;
  scoringapp_play_id: string;
  play_type: string;
  highlight_created: string;
};
export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type Playlist = {
  title: string;
  description: string;
  id: string;
  user_id: string;
  name: string;
  playlist: HighlightVideo[];
  created_at: string;
  updated_at: string;
};
