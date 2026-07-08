export class LeaderboardEntry {
    private readonly _id: string;
    private readonly _userId: string;
    private readonly _username: string;
    private readonly _levelId: number;
    private readonly _score: number;
    private readonly _recordedAt: Date;

    constructor(id: string, userId: string, username: string, levelId: number, score: number, recordedAt: Date = new Date()) {
        this._id = id;
        this._userId = userId;
        this._username = username;
        this._levelId = levelId;
        this._score = score;
        this._recordedAt = recordedAt;
    }

    get id(): string {
        return this._id;
    }

    get userId(): string {
        return this._userId;
    }

    get username(): string {
        return this._username;
    }

    get levelId(): number {
        return this._levelId;
    }

    get score(): number {
        return this._score;
    }

    get recordedAt(): Date {
        return this._recordedAt;
    }
}
