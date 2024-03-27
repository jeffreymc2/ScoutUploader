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
    created_at: string;
        player_id: string | null;
        id: string;
        name: string;
        object_id: string;
        post_by: string;
        profiles: { display_name: string | null } | null;
        image: string;
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