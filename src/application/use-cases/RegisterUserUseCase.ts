import { IUseCase } from '../interfaces/IUseCase';
import { IUserRepository } from '../ports/repositories/IUserRepository';
import { IProgressRepository } from '../ports/repositories/IProgressRepository';
import { User } from '../../domain/entities/User';
import { PlayerProgress } from '../../domain/entities/PlayerProgress';
import { InvalidDomainDataException } from '../../domain/exceptions/InvalidDomainDataException';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface RegisterUserInput {
    username: string;
    password?: string;
}

export interface RegisterUserOutput {
    user: {
        id: string;
        username: string;
    };
    progress: PlayerProgress;
}

export class RegisterUserUseCase implements IUseCase<RegisterUserInput, RegisterUserOutput> {
    constructor(
        private userRepository: IUserRepository,
        private progressRepository: IProgressRepository
    ) {}

    async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
        if (!input.username) {
            throw new InvalidDomainDataException("Username is required");
        }

        const existingUser = await this.userRepository.findByUsername(input.username);
        if (existingUser) {
            throw new InvalidDomainDataException("User already exists");
        }

        // Generate UUID
        const newId = crypto.randomUUID();
        
        let passwordHash = '';
        if (input.password) {
            const saltRounds = 10;
            passwordHash = await bcrypt.hash(input.password, saltRounds);
        }

        const newUser = new User(newId, input.username, passwordHash);
        const initialProgress = new PlayerProgress(); // Defaults to 5 lives, 0 coins, highest level 0

        await this.userRepository.save(newUser);
        await this.progressRepository.createInitialProgress(newUser.id);

        return {
            user: {
                id: newUser.id,
                username: newUser.username
            },
            progress: initialProgress
        };
    }
}
