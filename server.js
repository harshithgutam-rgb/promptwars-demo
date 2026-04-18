require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.json());

// Basic Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const { message, city, environment, venue, crowdData } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are OmniEvent AI, a friendly, smart crowd navigation assistant.

Context:
* City: ${city || 'Unknown'}
* Environment: ${environment || 'Unknown'}
* Venue: ${venue || 'Unknown'}
* Crowd Data: ${JSON.stringify(crowdData || {})}

Instructions:
* Act seamlessly as a knowledgeable concierge. Be natural, polite, and helpful.
* Always respond with location-aware answers mentioning the city (${city || 'Unknown'}) AND venue name (${venue || 'Unknown'}).
* Provide short, practical answers (max 3 sentences).
* When live crowd data is limited or unavailable for a location, ALWAYS end the response with a suggestion:  "For full live tracking, try Hyderabad, Mumbai, or Delhi."
* Ensure this suggestion is consistently included at the end of the response when data is missing or incomplete.
* Keep it natural, polite, and conversational (not robotic).
* If Crowd Data is populated, suggest less crowded routes based on wait times.
* If Crowd Data is empty or missing, provide generalized logical advice for the environment (e.g. 'At airports, security gates are usually quickest during...'). Call out that live data is limited but you are still here to help.
* Be highly contextual and location-aware.
* Do not use robotic phrasing; keep it highly practical and conversational.`;

        const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;

        const result = await model.generateContent(fullPrompt);
        // Sanitize LLM text to prevent XSS injection before sending to frontend
        const responseText = result.response.text().replace(/</g, "&lt;").replace(/>/g, "&gt;");

        res.json({ reply: responseText });
    } catch (error) {
        console.error("Gemini API error:", error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
