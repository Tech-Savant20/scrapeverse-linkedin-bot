# 🚀 Scrape-Verse LinkedIn Bot

An automated, self-healing pipeline that scrapes the latest engineering articles and synthesizes them into an engaging LinkedIn post using AI. Built for the WeMakeDevs "Into the Scrape-Verse" Hackathon.

## 🏗️ Architecture (Prompt-to-Production)
1. **Data Ingestion:** Bright Data's Scraper Studio (`POST /dca/trigger`) extracts titles, summaries, and URLs from public engineering blogs.
2. **Orchestration:** A Node.js backend fetches the structured JSON asynchronously.
3. **Synthesis:** The Gemini 1.5 Flash API processes the technical data and generates a professional, formatted LinkedIn post with hooks and hashtags.

## 🛠️ Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory:
   ```env
   BRIGHT_DATA_API_TOKEN=your_token
   GEMINI_API_KEY=your_key
