"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrokPackageSuggestion = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
// Ensure Firebase Admin is initialized (if not already in index.ts)
if (admin.apps.length === 0) {
    admin.initializeApp();
}
// It's highly recommended to set your Grok API key as an environment variable
// in your Firebase project settings:
// firebase functions:config:set grok.apikey="YOUR_ACTUAL_API_KEY"
// Then deploy your functions.
// For local testing with emulators, you might use a .env file and process.env,
// or set it in functions.config().
const GROK_API_KEY = ((_a = functions.config().grok) === null || _a === void 0 ? void 0 : _a.apikey) || process.env.GROK_API_KEY;
const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
exports.getGrokPackageSuggestion = functions.https.onRequest(async (req, res) => {
    var _a;
    // Set CORS headers for all responses
    res.set("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // Handle preflight OPTIONS requests
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    if (!GROK_API_KEY) {
        console.error("Grok API key is not configured on the server.");
        res.status(500).json({ error: "Grok API key is not configured." });
        return;
    }
    // For onRequest, data is in req.body. For onCall, it was data directly.
    // Assuming the client will send a POST request with JSON body
    const { userInput, packages } = req.body.data || req.body; // req.body.data for callable-style POST
    if (!userInput || !packages || !Array.isArray(packages) || packages.length === 0) {
        console.error("Invalid arguments received:", { userInput, packages });
        res.status(400).json({ error: "Invalid arguments. 'userInput' and 'packages' (array) are required." });
        return;
    }
    // Construct a detailed prompt for Grok
    let prompt = `You are Sarah, an AI wedding photography consultant for Hariel Xavier Photography.
A potential client has provided the following information about their needs: "${userInput}".

Here are the available photography packages:
`;
    packages.forEach((pkg, index) => {
        prompt += `
Package ${index + 1}: ${pkg.name}
Price: $${pkg.price}
${pkg.usp ? `Unique Selling Point: ${pkg.usp}` : ""}
Features:
`;
        pkg.features.forEach(feature => {
            prompt += `- ${typeof feature === 'string' ? feature : feature.text}\n`;
        });
        if (pkg.perfectFor && pkg.perfectFor.length > 0) {
            prompt += `Perfect For: ${pkg.perfectFor.join(", ")}\n`;
        }
    });
    prompt += `
Based on the client's needs ("${userInput}") and the available packages, please recommend the single most suitable package and briefly explain why in a friendly, helpful, and concise tone.
Address the client directly. Start your response with "Okay, based on what you've told me..."
Focus on recommending one specific package by name from the list provided.
If multiple packages seem suitable, pick the one that offers the best value or coverage for the stated needs.
If no package seems like a good fit, you can gently suggest a custom consultation.
Keep your entire response to 2-3 sentences.
`;
    try {
        const axiosResponse = await axios_1.default.post(GROK_API_URL, {
            model: "grok-1.5-flash",
            messages: [
                { role: "user", content: prompt },
            ],
            temperature: 0.7, // Adjust for creativity vs. predictability
        }, {
            headers: {
                "Authorization": `Bearer ${GROK_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        if (axiosResponse.data && axiosResponse.data.choices && axiosResponse.data.choices.length > 0) {
            // For onRequest, send response via res.json()
            // The client SDK for onCall expects a 'data' wrapper, so we mimic that for consistency if client code isn't changed.
            res.status(200).json({ data: { suggestion: axiosResponse.data.choices[0].message.content } });
        }
        else {
            console.error("Grok API returned an unexpected response structure:", axiosResponse.data);
            res.status(500).json({ error: "Grok API returned an unexpected response structure." });
        }
    }
    catch (error) {
        console.error("Error calling Grok API:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        let errorMessage = "Failed to get a suggestion from Sarah AI.";
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
            errorMessage = `Sarah AI Error: ${error.response.data.error.message}`;
        }
        else if (error.message) {
            errorMessage = `Sarah AI Error: ${error.message}`;
        }
        // For onRequest, send error response via res.status().json()
        res.status(500).json({ error: errorMessage });
    }
});
//# sourceMappingURL=grokAIBackend.js.map