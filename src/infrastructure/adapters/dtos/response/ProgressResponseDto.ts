export interface ProgressResponseDto {
  userId: string;
  highestLevelCompleted: number;
  lives: number;
  coins: number;
  completedLevels: {
    levelId: number;
    stars: number;
    score: number;
  }[];
}
