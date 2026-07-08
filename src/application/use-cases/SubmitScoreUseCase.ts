import { IUseCase } from '../interfaces/IUseCase';
import { ILeaderboardRepository } from '../ports/repositories/ILeaderboardRepository';
import { LeaderboardEntry } from '../../domain/entities/LeaderboardEntry';
import { InvalidDomainDataException } from '../../domain/exceptions/InvalidDomainDataException';
import crypto from 'crypto';

export interface SubmitScoreInput {
    userId: string;
    username: string;
    levelId: number;
    score: number;
}

export interface SubmitScoreOutput {
    success: boolean;
    entryId: string;
}

export class SubmitScoreUseCase implements IUseCase<SubmitScoreInput, SubmitScoreOutput> {
    constructor(private leaderboardRepository: ILeaderboardRepository) {}

    async execute(input: SubmitScoreInput): Promise<SubmitScoreOutput> {
        if (typeof input.score !== 'number' || typeof input.levelId !== 'number') {
            throw new InvalidDomainDataException("Score and levelId must be valid numbers.");
        }

        if (input.score <= 0 || input.score > 10) {
            throw new InvalidDomainDataException("Score must be greater than 0 and less than or equal to 10.");
        }

        const entryId = crypto.randomUUID();
        const entry = new LeaderboardEntry(entryId, input.userId, input.username, input.levelId, input.score);
        
        await this.leaderboardRepository.save(entry);

        return {
            success: true,
            entryId
        };
    }
}
