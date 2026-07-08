import { DomainException } from './DomainException';

export class InvalidDomainDataException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}
