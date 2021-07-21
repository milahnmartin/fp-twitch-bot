export interface twitch  {
    identify:{username:string,password:string},
    channels:string[]
}


export interface player_stats {
    'Average Headshots %':string,
    'Average K/D Ratio':string,
    'Current Win Streak':string,
    'K/D Ratio':string,
    'Longest Win Streak':string,
    Matches:string
    'Recent Results':string[],
    'Total Headshots %':string,
    'Win Rate %':string,
    Wins:string,


}



export interface error_api {
    name:string,
    error_type:string,
    reason:string,
    fix:string
}