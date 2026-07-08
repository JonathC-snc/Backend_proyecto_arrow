import { IUseCase } from '../interfaces/IUseCase';
import { IProgressRepository } from '../ports/repositories/IProgressRepository';
import { InvalidDomainDataException } from '../../domain/exceptions/InvalidDomainDataException';
import { InsufficientFundsException } from '../../domain/exceptions/InsufficientFundsException';

export enum PowerUpType {
    HINT = 'HINT',
    HAMMER = 'HAMMER',
    HIGHLIGHT = 'HIGHLIGHT'
}

export interface BuyPowerUpInput {
    userId: string;
    powerUpType: PowerUpType;
    cost: number;
}

export interface BuyPowerUpOutput {
    success: boolean;
    powerUpType: PowerUpType;
    remainingCoins: number;
}

export class BuyPowerUpUseCase implements IUseCase<BuyPowerUpInput, BuyPowerUpOutput> {
    constructor(
        private progressRepository: IProgressRepository
    ) {}

    async execute(input: BuyPowerUpInput): Promise<BuyPowerUpOutput> {
        const progress = await this.progressRepository.findByUserId(input.userId);
        if (!progress) {
            throw new InvalidDomainDataException("Player progress not found.");
        }

        // The domain entity is responsible for checking funds and throwing InsufficientFundsException
        progress.spendCoins(input.cost);

        await this.progressRepository.save(input.userId, progress);

        return {
            success: true,
            powerUpType: input.powerUpType,
            remainingCoins: progress.coins
        };
    }
}
