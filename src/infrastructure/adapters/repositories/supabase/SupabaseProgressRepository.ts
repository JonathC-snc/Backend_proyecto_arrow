import { IProgressRepository } from '../../../../application/ports/repositories/IProgressRepository';
import { PlayerProgress } from '../../../../domain/entities/PlayerProgress';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseProgressRepository implements IProgressRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findByUserId(userId: string): Promise<PlayerProgress | null> {
    const { data, error } = await this.supabase
      .from('player_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    // En Supabase, PGRST116 significa "0 rows returned" (No se encontró el registro)
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Database error looking up progress: ${error.message}`);
    }

    if (!data) return null;

    return new PlayerProgress(data.lives, data.coins, data.highest_level_completed);
  }

  async createInitialProgress(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('player_progress')
      .insert({
        user_id: userId,
        lives: 5,
        coins: 0,
        highest_level_completed: 0
      });

    if (error) {
      throw new Error(`Failed to create initial progress: ${error.message}`);
    }
  }

  async save(userId: string, progress: PlayerProgress): Promise<void> {
    const { error } = await this.supabase
      .from('player_progress')
      .upsert({
        user_id: userId,
        lives: progress.lives,
        coins: progress.coins,
        highest_level_completed: progress.highestLevelCompleted
      });

    if (error) {
      throw new Error(`Failed to save progress: ${error.message}`);
    }
  }
}
