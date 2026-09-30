# Scrape-Verse LinkedIn Bot

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Bright Data](https://img.shields.io/badge/Bright%20Data-Scraper-3D7FFC)
![Gemini](https://img.shields.io/badge/Google-Gemini%20API-4285F4?logo=google&logoColor=white)

A small Node.js pipeline that scrapes the latest posts from the [GitHub Engineering blog](https://github.blog/category/engineering/) with Bright Data and asks Google Gemini to turn them into a ready-to-post LinkedIn update.

Built for the WeMakeDevs **Into the Scrape-Verse** hackathon (August 2026).

## How it works

```
Bright Data scraper (CLI) ──► JSON list of articles ──► prompt ──► Gemini API ──► LinkedIn post (printed to the terminal)
```

1. **Scrape:** runs your Bright Data scraper through the Bright Data CLI (`bdata scraper run`) against the GitHub Engineering blog and reads the JSON array it prints.
2. **Prompt:** builds a prompt asking for a single professional LinkedIn post with a hook, bullet points and three hashtags, with the scraped articles attached as data.
3. **Generate:** sends the prompt to the Gemini `generateContent` endpoint (model `gemini-3.5-flash`) and prints the result.

The script checks for API errors and empty responses, such as a safety block, and prints a clear message instead of crashing.

## Getting started

**Requirements:** Node.js 18 or newer (the script uses the built-in `fetch`), a Bright Data account with a scraper set up for the blog, and a Gemini API key from [Google AI Studio](https://aistudio.google.com/).

```bash
git clone https://github.com/Tech-Savant20/scrapeverse-linkedin-bot.git
cd scrapeverse-linkedin-bot
npm install
```

Create a `.env` file in the project root:

```env
# ID of your Bright Data scraper (passed to `bdata scraper run`)
BRIGHT_DATA_API_TOKEN=your_scraper_id
GEMINI_API_KEY=your_gemini_api_key
```

The Bright Data CLI is fetched on demand with `npx -p @brightdata/cli`, and it must be signed in to your Bright Data account. Then run:

```bash
node generate_post.js
```

The generated post is printed between two divider lines, ready to copy.

## Project structure

```
scrapeverse-linkedin-bot/
├── generate_post.js   # scrape → prompt → Gemini → print
├── package.json
└── .env               # your keys (git-ignored)
```

## Notes

- Despite its name, `BRIGHT_DATA_API_TOKEN` holds the scraper ID, not an API token.
- The target URL is hard-coded in `generate_post.js`; change it to summarise a different blog.
- The post is printed, not published. Posting to LinkedIn automatically would need LinkedIn's API and OAuth.

## Tech stack

Node.js, Bright Data CLI, Google Gemini API, dotenv.
