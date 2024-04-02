// app/lib/types/types.ts

export interface Player {
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

  
  
export interface Post {
  id: string;
  created_at: string;
  player_id: string | null;
  name: string;
  object_id: string;
  post_by: string;
  profile: {
    display_name: string | null;
  } | null;
  image: string;
  event_id?: string;
  team_id?: string;
  isVideo?: boolean;
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
  };

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
  };
  