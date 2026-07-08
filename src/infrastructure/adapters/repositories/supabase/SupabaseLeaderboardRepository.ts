import { ILeaderboardRepository } from '../../../../application/ports/repositories/ILeaderboardRepository';
import { LeaderboardEntry } from '../../../../domain/entities/LeaderboardEntry';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseLeaderboardRepository implements ILeaderboardRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async save(entry: LeaderboardEntry): Promise<void> {
    const { error } = await this.supabase
      .from('leaderboard')
      .upsert({
        id: entry.id,
        level_id: entry.levelId,
        user_id: entry.userId,
        username: entry.username,
        score: entry.score,
        recorded_at: entry.recordedAt.toISOString()
      });

    if (error) {
      throw new Error(`Failed to save leaderboard entry: ${error.message}`);
    }
  }

  async getTopScoresByLevel(levelId: number, limit: number): Promise<LeaderboardEntry[]> {
    const { data, error } = await this.supabase
      .from('leaderboard')
      .select('*')
      .eq('level_id', levelId)
      .order('score', { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map(row => {
      return new LeaderboardEntry(row.id, row.user_id, row.username, row.level_id, row.score, row.recorded_at ? new Date(row.recorded_at) : new Date());
    });
  }
}
