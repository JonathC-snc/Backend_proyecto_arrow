import { LevelDefinition } from '../../../domain/entities/LevelDefinition';

export interface ILevelRepository {
    findById(id: number): Promise<LevelDefinition | null>;
}
