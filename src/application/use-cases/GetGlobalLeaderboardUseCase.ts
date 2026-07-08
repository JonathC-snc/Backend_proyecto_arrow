import { IUseCase } from '../interfaces/IUseCase';
import { ILeaderboardRepository } from '../ports/repositories/ILeaderboardRepository';
import { LeaderboardEntry } from '../../domain/entities/LeaderboardEntry';

export interface GetGlobalLeaderboardInput {
    levelId: number;
}

export interface GetGlobalLeaderboardOutput {
    entries: LeaderboardEntry[];
}

export class GetGlobalLeaderboardUseCase implements IUseCase<GetGlobalLeaderboardInput, GetGlobalLeaderboardOutput> {
    constructor(private leaderboardRepository: ILeaderboardRepository) {}

    async execute(input: GetGlobalLeaderboardInput): Promise<GetGlobalLeaderboardOutput> {
        // Obtenemos el top 50
        const limit = 50;
        const entries = await this.leaderboardRepository.getTopScoresByLevel(input.levelId, limit);
        
        return {
            entries
        };
    }
}
