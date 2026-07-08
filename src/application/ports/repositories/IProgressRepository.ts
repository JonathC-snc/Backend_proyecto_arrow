import { PlayerProgress } from '../../../domain/entities/PlayerProgress';

export interface IProgressRepository {
    findByUserId(userId: string): Promise<PlayerProgress | null>;
    save(userId: string, progress: PlayerProgress): Promise<void>;
    createInitialProgress(userId: string): Promise<void>;
}
