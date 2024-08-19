import { config } from 'dotenv';
config();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
if (!DISCORD_BOT_TOKEN) throw new Error('Please Input DISCORD_BOT_TOKEN');
export { DISCORD_BOT_TOKEN };

export const DISCORD_BASE_URL = 'https://discord.com/api/v10';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('Please Input DATABASE_URL');
export { DATABASE_URL };
