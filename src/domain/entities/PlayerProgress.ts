import { InvalidDomainDataException } from '../exceptions/InvalidDomainDataException';
import { InsufficientFundsException } from '../exceptions/InsufficientFundsException';

export class PlayerProgress {
    private _lives: number;
    private _coins: number;
    private _highestLevelCompleted: number;

    private static readonly MAX_LIVES = 5;

    constructor(lives: number = 5, coins: number = 0, highestLevelCompleted: number = 0) {
        if (lives < 0 || lives > PlayerProgress.MAX_LIVES) {
            throw new InvalidDomainDataException(`Lives must be between 0 and ${PlayerProgress.MAX_LIVES}.`);
        }
        if (coins < 0) {
            throw new InvalidDomainDataException("Coins cannot be negative.");
        }
        if (highestLevelCompleted < 0) {
            throw new InvalidDomainDataException("Highest level completed cannot be negative.");
        }

        this._lives = lives;
        this._coins = coins;
        this._highestLevelCompleted = highestLevelCompleted;
    }

    get lives(): number {
        return this._lives;
    }

    get coins(): number {
        return this._coins;
    }

    get highestLevelCompleted(): number {
        return this._highestLevelCompleted;
    }

    loseLife(): void {
        if (this._lives <= 0) {
            throw new InvalidDomainDataException("Cannot lose life. Lives already at 0.");
        }
        this._lives -= 1;
    }

    addCoins(amount: number): void {
        if (amount < 0) {
            throw new InvalidDomainDataException("Cannot add a negative amount of coins.");
        }
        this._coins += amount;
    }

    spendCoins(amount: number): void {
        if (amount < 0) {
            throw new InvalidDomainDataException("Cannot spend a negative amount of coins.");
        }
        if (this._coins < amount) {
            throw new InsufficientFundsException();
        }
        this._coins -= amount;
    }

    winLevel(): void {
        this._highestLevelCompleted += 1;
    }
}
