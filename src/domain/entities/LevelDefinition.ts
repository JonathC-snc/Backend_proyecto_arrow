export interface BoardCoordinate {
    x: number;
    y: number;
    direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
    color: string;
}

export class LevelDefinition {
    private readonly _id: number;
    private readonly _boardConfig: Record<string, BoardCoordinate>;
    private readonly _maxMoves: number;
    private readonly _isPublished: boolean;

    constructor(id: number, boardConfig: Record<string, BoardCoordinate>, maxMoves: number, isPublished: boolean = true) {
        this._id = id;
        this._boardConfig = boardConfig;
        this._maxMoves = maxMoves;
        this._isPublished = isPublished;
    }

    get id(): number {
        return this._id;
    }

    get boardConfig(): Record<string, BoardCoordinate> {
        return this._boardConfig; // Returning a reference. Could deep copy for strict immutability.
    }

    get maxMoves(): number {
        return this._maxMoves;
    }

    get isPublished(): boolean {
        return this._isPublished;
    }
}
