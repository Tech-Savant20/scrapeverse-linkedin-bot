require('dotenv').config();
const { execSync } = require('child_process');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const COLLECTOR_ID = process.env.BRIGHT_DATA_API_TOKEN;

async function runPipeline() {
    console.log("🚀 Triggering Bright Data CLI Scraper...");
    
    try {
        // 1. Trigger the scraper via local CLI instead of API
        const rawJson = execSync(
            `npx -p @brightdata/cli bdata scraper run ${COLLECTOR_ID} "https://github.blog/category/engineering/" --pretty`
        ).toString();
        
        // Clean the CLI output to grab just the JSON array
        const jsonStartIndex = rawJson.indexOf('['); 
        const jsonEndIndex = rawJson.lastIndexOf(']') + 1;
        
        if (jsonStartIndex === -1) {
            throw new Error("Could not find JSON array in CLI output. Raw output:\n" + rawJson);
        }

        const scrapeDataStr = rawJson.slice(jsonStartIndex, jsonEndIndex);
        const scrapeData = JSON.parse(scrapeDataStr);

        console.log("✅ Data Scraped! Building prompt...");

        // 2. Build the Prompt for the LLM
        const prompt = `
        You are an expert developer advocate. Turn the following scraped engineering articles into a single, highly engaging LinkedIn post. 
        Make it professional, add a hook, use bullet points, and include 3 relevant hashtags. 
        Data: ${JSON.stringify(scrapeData)}
        `;

        console.log("🧠 Sending to LLM...");

        // 3. Call the LLM to synthesize the data
        const llmResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const llmData = await llmResponse.json();
        
        // --- NEW SAFETY CHECKS ---
        if (llmData.error) {
            throw new Error(`Gemini API Error: ${llmData.error.message}`);
        }
        
        if (!llmData.candidates || llmData.candidates.length === 0) {
            throw new Error(`Unexpected Gemini Response (likely a safety block): ${JSON.stringify(llmData, null, 2)}`);
        }
        // -------------------------

        const linkedInPost = llmData.candidates[0].content.parts[0].text;

        console.log("\n================ LINKEDIN POST ================\n");
        console.log(linkedInPost);
        console.log("\n==============================================\n");
    } catch (error) {
        console.error("\n❌ Pipeline Error:", error.message || error);
    }
}

runPipeline();