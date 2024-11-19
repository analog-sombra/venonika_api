import { DiscordScheduledEvent } from 'src/event/entities/event.entity';
import { UserSchema } from 'src/user/entities/user.entity';

export interface DiscordInviteSchema {
  type: number;
  code: string;
  // guild: guild;
  // channel:
  inviter: UserSchema;
  target_type: number;
  target_user: UserSchema;
  // target_application:
  approximate_presence_count: number;
  approximate_member_count: number;
  expires_at: string;
  //   stage_instance:
  guild_scheduled_event: DiscordScheduledEvent;
}

export class DiscordGuildSchema {
  id: string; // Snowflake identifier
  name: string;
  icon: string | null;
  icon_hash?: string | null;
  splash: string | null;
  discovery_splash: string | null;
  owner?: boolean;
  owner_id: string; // Snowflake identifier for owner
  permissions?: string; // String representing the user's permissions
  region?: string | null; // Deprecated
  afk_channel_id: string | null; // Snowflake for the AFK channel
  afk_timeout: number; // AFK timeout in seconds
  widget_enabled?: boolean;
  widget_channel_id?: string | null;
  verification_level: VerificationLevel;
  default_message_notifications: DefaultMessageNotificationLevel;
  explicit_content_filter: ExplicitContentFilterLevel;
  roles: RoleSchema[];
  emojis: Emoji[];
  features: GuildFeature[];
  mfa_level: MFALevel;
  application_id: string | null;
  system_channel_id: string | null;
  system_channel_flags: number;
  rules_channel_id: string | null;
  max_presences?: number | null;
  max_members?: number;
  vanity_url_code: string | null;
  description: string | null;
  banner: string | null;
  premium_tier: PremiumTier;
  premium_subscription_count?: number;
  preferred_locale: string;
  public_updates_channel_id: string | null;
  max_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  welcome_screen?: WelcomeScreen;
  nsfw_level: NSFWLevel;
  stickers?: Sticker[];
  premium_progress_bar_enabled: boolean;
}

export type VerificationLevel =
  | 0 // "NONE"
  | 1 // "LOW"
  | 2 // "MEDIUM"
  | 3 // "HIGH"
  | 4; // "VERY_HIGH";

export type DefaultMessageNotificationLevel =
  | 0 // "ALL_MESSAGES"
  | 1; // "ONLY_MENTIONS";

export type ExplicitContentFilterLevel =
  | 0 // "DISABLED"
  | 1 // "MEMBERS_WITHOUT_ROLES"
  | 2; // "ALL_MEMBERS";

export interface RoleSchema {
  id: string; // Snowflake identifier
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: string; // Bitwise permission flags
  managed: boolean;
  mentionable: boolean;
  tags?: RoleTags;
}

export interface Emoji {
  id: string | null;
  name: string | null;
  roles?: RoleSchema[];
  user?: UserSchema;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}

export interface GuildFeature {
  // Enum of features that a guild can have.
}

export type MFALevel = 0 | 1;

export type PremiumTier = 0 | 1 | 2 | 3;

export interface WelcomeScreen {
  description: string;
  welcome_channels: WelcomeScreenChannel[];
}

export interface WelcomeScreenChannel {
  channel_id: string;
  description: string;
  emoji_id: string | null;
  emoji_name: string | null;
}

export type NSFWLevel = 0 | 1 | 2 | 3;

export interface Sticker {
  id: string;
  name: string;
  description: string;
  tags: string;
  type: number;
  format_type: number;
  available?: boolean;
  guild_id?: string;
  user?: UserSchema;
  sort_value?: number;
}

export interface RoleTags {
  bot_id?: string;
  integration_id?: string;
  premium_subscriber?: null;
}

export type GuildSchema = {
  id: string;
  scrimLogChannel?: string;
  createdAt: Date;
  updatedAt: Date;
};
