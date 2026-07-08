import { DomainException } from './DomainException';

export class LevelRulesViolationException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}
