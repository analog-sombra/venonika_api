export interface UserSchema {
  id: string;
  userId: string;
  username: string;
  globalName?: string;
  avatar?: string;
  mfaEnabled?: string;
  verified?: string;
  email?: string;
  accessToken: string;
}

export interface DiscordUserSchema {
  id: string;
  username: string;
  discriminator?: string;
  global_name?: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string;
  accent_color?: number;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
  avatar_decoration_data?: { asset: string; sku_id: string };
}
