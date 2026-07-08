export interface AuthRequestDto {
  username: string;
  password?: string;
  provider?: 'email' | 'google' | 'apple';
}
