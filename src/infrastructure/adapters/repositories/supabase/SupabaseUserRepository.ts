import { IUserRepository } from '../../../../application/ports/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseUserRepository implements IUserRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return new User(data.id, data.username, data.password_hash, data.created_at ? new Date(data.created_at) : new Date());
  }

  async findByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) return null;
    return new User(data.id, data.username, data.password_hash, data.created_at ? new Date(data.created_at) : new Date());
  }

  async save(user: User): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .upsert({
        id: user.id,
        username: user.username,
        password_hash: user.passwordHash,
        created_at: user.createdAt.toISOString()
      });

    if (error) {
      throw new Error(`Failed to save user: ${error.message}`);
    }
  }
}
