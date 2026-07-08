export abstract class DomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        if ('captureStackTrace' in Error) {
            (Error as any).captureStackTrace(this, this.constructor);
        }
    }
}
