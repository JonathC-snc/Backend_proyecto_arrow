import { IUseCase } from '../interfaces/IUseCase';
import { IProgressRepository } from '../ports/repositories/IProgressRepository';
import { InvalidDomainDataException } from '../../domain/exceptions/InvalidDomainDataException';
import { InsufficientFundsException } from '../../domain/exceptions/InsufficientFundsException';

export interface BuyExtraMovesInput {
    userId: string;
    cost: number;
}

export interface BuyExtraMovesOutput {
    success: boolean;
    remainingCoins: number;
}

export class BuyExtraMovesUseCase implements IUseCase<BuyExtraMovesInput, BuyExtraMovesOutput> {
    constructor(
        private progressRepository: IProgressRepository
    ) {}

    async execute(input: BuyExtraMovesInput): Promise<BuyExtraMovesOutput> {
        const progress = await this.progressRepository.findByUserId(input.userId);
        if (!progress) {
            throw new InvalidDomainDataException("Player progress not found.");
        }

        // Spend coins. This method will throw InsufficientFundsException if not enough coins
        progress.spendCoins(input.cost);

        await this.progressRepository.save(input.userId, progress);

        return {
            success: true,
            remainingCoins: progress.coins
        };
    }
}
