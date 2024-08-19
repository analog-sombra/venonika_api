import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DiscordUserSchema } from 'src/user/entities/user.entity';

export enum ScheduledEventPrivacyLevel {
  STAGE_INSTANCE = 1,
  VOICE = 2,
  EXTERNAL = 3,
}

export enum ScheduledEventEntityType {
  STAGE_INSTANCE = 1,
  VOICE = 2,
  EXTERNAL = 3,
}

export enum ScheduledEventStatus {
  SCHEDULED = 1,
  ACTIVE = 2,
  COMPLETED = 3,
  CANCELED = 4,
}

export enum ScheduledEventRecurrenceFrequency {
  YEARLY = 0,
  MONTHLY = 1,
  WEEKLY = 2,
  DAILY = 3,
}

export enum ScheduledEventRecurrenceWeekday {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
  SATURDAY = 5,
  SUNDAY = 6,
}

export enum ScheduledEventRecurrenceMonth {
  JANUARY = 1,
  FEBRUARY = 2,
  MARCH = 3,
  APRIL = 4,
  MAY = 5,
  JUNE = 6,
  JULY = 7,
  AUGUST = 8,
  SEPTEMBER = 9,
  OCTOBER = 10,
  NOVEMBER = 11,
  DECEMBER = 12,
}

export interface ScheduledEventRecurrenceN_Weekday {
  n: 1 | 2 | 3 | 4 | 5;
  day: ScheduledEventRecurrenceWeekday;
}

export interface ScheduledEventRecurrenceRule {
  start: Date;
  end?: Date;
  frequency: ScheduledEventRecurrenceFrequency;
  interval: number;
  by_weekday?: ScheduledEventRecurrenceWeekday[];
  by_n_weekday?: ScheduledEventRecurrenceN_Weekday;
  by_month?: ScheduledEventRecurrenceMonth;
  by_month_day?: number[];
  by_year_day?: number[];
  count?: number;
}

export interface DiscordScheduledEvent {
  id: string;
  guild_id: string;
  channel_id?: string;
  creator_id?: string;
  name: string;
  description?: string;
  scheduled_start_time: Date;
  scheduled_end_time?: Date;
  privacy_level: ScheduledEventPrivacyLevel;
  status: ScheduledEventStatus;
  entity_type: ScheduledEventEntityType;
  entity_id?: string;
  entity_metadata?: {
    location?: string;
  };
  creator?: DiscordUserSchema;
  user_count?: number;
  image?: string;
  recurrence_rule?: ScheduledEventRecurrenceRule;
}

// Nested Interfaces as Classes
export class ScheduledEventRecurrenceN_WeekdayClass {
  @IsInt()
  n: 1 | 2 | 3 | 4 | 5;

  @IsEnum(ScheduledEventRecurrenceWeekday)
  day: ScheduledEventRecurrenceWeekday;
}

export class ScheduledEventRecurrenceRuleClass {
  @IsDate()
  @Type(() => Date)
  start: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end?: Date;

  @IsEnum(ScheduledEventRecurrenceFrequency)
  frequency: ScheduledEventRecurrenceFrequency;

  @IsInt()
  interval: number;

  @IsOptional()
  @IsEnum(ScheduledEventRecurrenceWeekday, { each: true })
  by_weekday?: ScheduledEventRecurrenceWeekday[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ScheduledEventRecurrenceN_WeekdayClass)
  by_n_weekday?: ScheduledEventRecurrenceN_Weekday;

  @IsOptional()
  @IsEnum(ScheduledEventRecurrenceMonth)
  by_month?: ScheduledEventRecurrenceMonth;

  @IsOptional()
  @IsInt({ each: true })
  by_month_day?: number[];

  @IsOptional()
  @IsInt({ each: true })
  by_year_day?: number[];

  @IsOptional()
  @IsInt()
  count?: number;
}

// Main Class
export class DiscordScheduledEventClass {
  @IsString()
  id: string;

  @IsString()
  guild_id: string;

  @IsOptional()
  @IsString()
  channel_id?: string;

  @IsOptional()
  @IsString()
  creator_id?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDate()
  @Type(() => Date)
  scheduled_start_time: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  scheduled_end_time?: Date;

  @IsEnum(ScheduledEventPrivacyLevel)
  privacy_level: ScheduledEventPrivacyLevel;

  @IsEnum(ScheduledEventStatus)
  status: ScheduledEventStatus;

  @IsEnum(ScheduledEventEntityType)
  entity_type: ScheduledEventEntityType;

  @IsOptional()
  @IsString()
  entity_id?: string;

  @IsOptional()
  creator?: DiscordUserSchema; // Assume DiscordUserSchema is defined elsewhere

  @IsOptional()
  @IsInt()
  user_count?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ScheduledEventRecurrenceRuleClass)
  recurrence_rule?: ScheduledEventRecurrenceRule;
}

export interface EventSchema {
  id: string;
  eventId: string;
  guildId: string;
  channelId: string;
  name: string;
  description: string;
  creatorId: string;
  imageUrl: string;
  tags: string;
  scheduledStartTime: string;
  status: ScheduledEventStatus;
}
