export interface LeaderboardResponseDto {
  entries: {
    rank: number;
    username: string;
    score: number;
  }[];
}
