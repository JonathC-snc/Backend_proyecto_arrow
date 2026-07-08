import { DomainException } from './DomainException';

export class InsufficientFundsException extends DomainException {
    constructor(message: string = "Insufficient coins for this operation.") {
        super(message);
    }
}
