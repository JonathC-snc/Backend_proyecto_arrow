export class User {
    private readonly _id: string;
    private readonly _username: string;
    private readonly _passwordHash: string;
    private readonly _createdAt: Date;

    constructor(id: string, username: string, passwordHash: string = '', createdAt: Date = new Date()) {
        this._id = id;
        this._username = username;
        this._passwordHash = passwordHash;
        this._createdAt = createdAt;
    }

    get id(): string {
        return this._id;
    }

    get username(): string {
        return this._username;
    }

    get passwordHash(): string {
        return this._passwordHash;
    }

    get createdAt(): Date {
        return this._createdAt;
    }
}
