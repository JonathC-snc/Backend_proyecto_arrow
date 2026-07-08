import { LeaderboardEntry } from '../../../domain/entities/LeaderboardEntry';

export interface ILeaderboardRepository {
    save(entry: LeaderboardEntry): Promise<void>;
    getTopScoresByLevel(levelId: number, limit: number): Promise<LeaderboardEntry[]>;
}
