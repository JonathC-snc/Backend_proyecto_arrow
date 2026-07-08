import { ITokenService } from '../../../application/ports/services/ITokenService';
import jwt from 'jsonwebtoken';

export class JwtTokenService implements ITokenService {
    private readonly secret: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || 'default-dev-secret-key-12345';
    }

    generateToken(payload: object): string {
        return jwt.sign(payload, this.secret, { expiresIn: '7d' });
    }

    verifyToken(token: string): any {
        return jwt.verify(token, this.secret);
    }
}
