interface identify {
  identity: string;
  password: string;
}
export interface twitch {
  identify: identify;
  channels: string[];
}

export interface player_stats {
  "Average Headshots %": string;
  "Average K/D Ratio": string;
  "Current Win Streak": string;
  "K/D Ratio": string;
  "Longest Win Streak": string;
  Matches: string;
  "Recent Results": string[];
  "Total Headshots %": string;
  "Win Rate %": string;
  Wins: string;
}

export interface error_api {
  name: string;
  error_type: string;
  reason: string;
  fix: string;
}

export interface maps_stats {
  "Average Assists": string;
  "Average Deaths": string;
  "Average Headshots %": string;
  "Average K/D Ratio": string;
  "Average K/R Ratio": string;
  "Average Kills": string;
  "Average MVPs": string;
  "Average Penta Kills": string;
  "Average Quadro Kills": string;
  "Average Triple Kills": string;
  Deaths: string;
  Headshots: string;
  "Headshots per Match": string;
  "K/D Ratio": string;
  "K/R Ratio": string;
  Kills: string;
  MVPs: string;
  Matches: string;
  "Penta Kills": string;
  "Quadro Kills": string;
  Rounds: string;
  "Total Headshots %": string;
  "Triple Kills": string;
  "Win Rate %": string;
  Wins: string;
}

export interface maps_response {
  img_regular: url;
  img_small: url;
  label: string;
  mode: string;
  stats: maps_stats;
  type: string;
}
