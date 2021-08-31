import { WebClient } from '@slack/web-api';
const { SLACK_BOT_TOKEN } = process.env

if (!SLACK_BOT_TOKEN) {
  console.error('Missing environment variable SLACK_BOT_TOKEN')
  process.exit(1)
}

export const slack = new WebClient(SLACK_BOT_TOKEN)
