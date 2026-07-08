import { IUseCase } from '../interfaces/IUseCase';
import { IUserRepository } from '../ports/repositories/IUserRepository';
import { ITokenService } from '../ports/services/ITokenService';
import { InvalidDomainDataException } from '../../domain/exceptions/InvalidDomainDataException';
import bcrypt from 'bcryptjs';

export interface LoginUserInput {
    username: string;
    password?: string;
}

export interface LoginUserOutput {
    token: string;
    user: {
        id: string;
        username: string;
    };
}

export class LoginUseCase implements IUseCase<LoginUserInput, LoginUserOutput> {
    constructor(
        private userRepository: IUserRepository,
        private tokenService: ITokenService
    ) {}

    async execute(input: LoginUserInput): Promise<LoginUserOutput> {
        if (!input.username || !input.password) {
            throw new InvalidDomainDataException("Username and password are required");
        }

        const user = await this.userRepository.findByUsername(input.username);
        if (!user) {
            throw new InvalidDomainDataException("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new InvalidDomainDataException("Invalid credentials");
        }

        const token = this.tokenService.generateToken({
            id: user.id,
            username: user.username
        });

        return {
            token,
            user: {
                id: user.id,
                username: user.username
            }
        };
    }
}
