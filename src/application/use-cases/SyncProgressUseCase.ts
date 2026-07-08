import { IUseCase } from '../interfaces/IUseCase';
import { IProgressRepository } from '../ports/repositories/IProgressRepository';
import { ILevelRepository } from '../ports/repositories/ILevelRepository';
import { PlayerProgress } from '../../domain/entities/PlayerProgress';
import { InvalidDomainDataException } from '../../domain/exceptions/InvalidDomainDataException';
import { LevelRulesViolationException } from '../../domain/exceptions/LevelRulesViolationException';


export interface SyncProgressInput {
    userId: string;
    username: string;
    levelId: number;
    score: number;
    stars: number;
    coins: number;
    lives: number;
    highest_level_completed: number;
}

export interface SyncProgressOutput {
    success: boolean;
    newTotalCoins: number;
    highestLevelCompleted: number;
}

export class SyncProgressUseCase implements IUseCase<SyncProgressInput, SyncProgressOutput> {
    constructor(
        private progressRepository: IProgressRepository,
        private levelRepository: ILevelRepository
    ) {}

    async execute(input: SyncProgressInput): Promise<SyncProgressOutput> {
        const progress = await this.progressRepository.findByUserId(input.userId);
        if (!progress) {
            throw new InvalidDomainDataException("Player progress not found.");
        }

        const levelDef = await this.levelRepository.findById(input.levelId);
        if (!levelDef) {
            throw new InvalidDomainDataException("Level definition not found.");
        }

        const coinsEarned = input.coins - progress.coins;
        
        // Anti-cheat validation: Max 10 coins per level based on requirements
        const MAX_COINS_PER_LEVEL = 10;
        if (coinsEarned > MAX_COINS_PER_LEVEL) {
            throw new LevelRulesViolationException(`Cannot earn more than ${MAX_COINS_PER_LEVEL} coins in a single level.`);
        }

        if (typeof input.lives !== 'number' || typeof input.coins !== 'number' || typeof input.highest_level_completed !== 'number') {
            throw new InvalidDomainDataException("lives, coins, and highest_level_completed must be valid numbers.");
        }

        // Compute new state
        const updatedLives = input.lives;
        const updatedCoins = input.coins;
        const updatedHighestLevel = Math.max(progress.highestLevelCompleted, input.highest_level_completed);
        
        // Instantiating the entity will trigger all Domain Guard Clauses (e.g. lives > 5, coins < 0)
        const updatedProgress = new PlayerProgress(updatedLives, updatedCoins, updatedHighestLevel);

        await this.progressRepository.save(input.userId, updatedProgress);

        return {
            success: true,
            newTotalCoins: updatedProgress.coins,
            highestLevelCompleted: updatedProgress.highestLevelCompleted
        };
    }
}
