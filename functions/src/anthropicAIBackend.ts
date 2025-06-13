import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

// Ensure Firebase Admin is initialized (if not already in index.ts)
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Using Anthropic Claude API
const ANTHROPIC_API_KEY = "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";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

// Package interface removed - using comprehensive package knowledge directly in prompts

interface QuizResponse {
  guestCount: number;
  venueType: string;
  budgetRange: string;
  socialFocus: string;
  specialNeeds: string[];
  weddingStyle: string;
  photographyPriority: string;
  timelineFlexibility: string;
}

interface PackageRecommendation {
  recommendedPackage: string;
  confidence: number;
  reasoning: string;
  suggestedAddOns: Array<{
    name: string;
    price: number;
    reasoning: string;
  }>;
  personalizedMessage: string;
}

export const getAnthropicPackageSuggestion = functions.https.onRequest(async (req, res) => {
  // Set CORS headers for all responses
  res.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (!ANTHROPIC_API_KEY) {
    console.error("Anthropic API key is not configured on the server.");
    res.status(500).json({ error: "Anthropic API key is not configured." });
    return;
  }

  // Handle different request types
  const requestData = req.body.data || req.body;
  
  if (requestData.type === 'packageRecommendation') {
    await handlePackageRecommendation(req, res, requestData.quizData);
  } else {
    await handleGeneralSuggestion(req, res, requestData);
  }
});

async function handlePackageRecommendation(req: functions.Request, res: functions.Response, quizData: QuizResponse) {
  if (!quizData) {
    console.error("Quiz data is required for package recommendation");
    res.status(400).json({ error: "Quiz data is required for package recommendation." });
    return;
  }

  // Create a detailed prompt for package recommendation with comprehensive package knowledge
  const prompt = `You are Sarah, the AI wedding photography consultant for Hariel Xavier Photography - a luxury wedding photography studio in Sparta, NJ with 14+ years of experience capturing timeless love stories.

HARIEL XAVIER PHOTOGRAPHY BRAND:
- Lead photographer: Mauricio Fernandez with 14+ years of professional wedding photography mastery
- 300+ weddings captured with artistic excellence by Mauricio
- Exclusive preferred photographer at The Club at Picatinny
- Specializes in both intimate elopements AND grand celebrations
- Known for natural light artistry, genuine emotions, and thoughtful composition
- Creates heirloom-quality memories for generations

A couple has completed our wedding photography quiz with the following responses:
- Guest Count: ${quizData.guestCount}
- Venue Type: ${quizData.venueType}
- Budget Range: ${quizData.budgetRange}
- Wedding Style: ${quizData.weddingStyle}
- Photography Priority: ${quizData.photographyPriority}
- Social Media Focus: ${quizData.socialFocus}
- Special Needs: ${quizData.specialNeeds.join(', ') || 'None'}
- Timeline Flexibility: ${quizData.timelineFlexibility}

COMPLETE PACKAGE LINEUP:

ELOPEMENT COLLECTIONS:
1. "elopement-intimate" - The Intimate ($1,595)
   - 3 hours of heartfelt coverage
   - 200+ professionally edited images
   - 10 sneak peeks within 24 hours
   - Perfect for: City hall vows, cozy backyard ceremonies, micro-venues

2. "elopement-adventure" - The Adventure ($2,195) [MOST POPULAR ELOPEMENT]
   - 4 hours of adventurous coverage
   - 300+ professionally edited images
   - 15 sneak peeks within 12 hours
   - Perfect for: Beach elopements, mountain vows, destination spots

3. "elopement-escape" - The Escape ($2,895)
   - 6 hours of immersive coverage
   - 400+ professionally edited images
   - 20 sneak peeks within 6 hours
   - Perfect for: Weekend getaways, multi-location stories

SINGLE PHOTOGRAPHER WEDDINGS:
4. "wedding-sparta-sparkler" - The Sparta Sparkler ($2,795)
   - 8 hours with Mauricio Fernandez
   - 500+ meticulously edited images
   - Engagement session included
   - Perfect for: Intimate weddings, budget-conscious couples

5. "wedding-xavier-classic" - The Xavier Classic ($3,295)
   - 9 hours with Mauricio Fernandez
   - 600+ artistically edited images
   - $150 print credit included
   - Perfect for: Traditional weddings, classic ceremonies

DUO COVERAGE WEDDINGS:
6. "duo-sussex-storyteller" - Sussex Storyteller Duo ($3,995) [MOST POPULAR OVERALL]
   - 9 hours with Mauricio + second photographer
   - 700+ stunningly edited images
   - Simultaneous bride & groom coverage
   - Perfect for: Medium to large weddings, comprehensive coverage

7. "duo-skylands-signature" - Skylands Signature Duo ($5,495)
   - 10 hours with team of 3 (Mauricio + second + assistant)
   - 900+ masterfully edited images
   - Next-day mini-movie sneak peek
   - Custom 10x10 Fine Art Album included
   - Perfect for: Large weddings, luxury venues

LUXURY EXPERIENCE:
8. "duo-xavier-xperience" - The Xavier Xperience ($7,995+)
   - Full weekend coverage (12 hours wedding + 3 hours rehearsal)
   - Elite team of 3 professionals
   - 1200+ magazine-quality images
   - Same-day slideshow at reception
   - Cinematic highlight film (5-7 minutes)
   - Luxury heirloom collection with albums
   - Perfect for: Luxury weddings, multi-day celebrations

BUDGET MAPPING:
- Under $3,000: Elopement packages
- $3,000-$5,000: Single photographer or Sussex Storyteller Duo
- $5,000-$8,000: Skylands Signature Duo
- $8,000+: Xavier Xperience

Based on their responses, provide a JSON response with the following structure:
{
  "recommendedPackage": "exact-package-id-from-above",
  "confidence": 85,
  "reasoning": "Detailed explanation of why this specific package fits their needs, referencing their guest count, budget, style, and priorities",
  "suggestedAddOns": [
    {
      "name": "Wedding Film Package",
      "price": 2200,
      "reasoning": "Why this add-on would benefit them based on their responses"
    }
  ],
  "personalizedMessage": "A warm, personal message from Sarah explaining the recommendation and next steps"
}

RECOMMENDATION LOGIC - CRITICAL ELOPEMENT FOCUS:

**ELOPEMENT TRIGGERS (MUST RECOMMEND ELOPEMENT PACKAGES):**
- Guest count under 50 people
- 4-6 hours of coverage requested
- Intimate, adventure, or outdoor celebration style
- Small budget (under $3,000)
- Words like "intimate," "elopement," "small," "adventure" mentioned

**ELOPEMENT PACKAGE MATCHING:**
- 3-4 hours needed = "elopement-adventure" (The Adventure - $2,195, 4 hours)
- 5-6 hours needed = "elopement-escape" (The Escape - $2,895, 6 hours)
- Very small/budget = "elopement-intimate" (The Intimate - $1,595, 3 hours)

**TRADITIONAL WEDDING PACKAGES ONLY FOR:**
- 50+ guests AND 8+ hours coverage
- Explicitly mentions "wedding" with large guest count
- Needs dual photographer coverage

**CRITICAL RULE:** If someone asks for 4 hours of coverage, this is CLEARLY an elopement scenario - recommend "The Adventure" elopement package ($2,195, 4 hours) as the perfect match.

**OTHER GUIDELINES:**
- Always reference Hariel's 14+ years of experience and artistic approach
- Mention the exclusive Picatinny Club partnership when venue type is relevant
- Emphasize heirloom quality and generational value in all recommendations

Be specific about why the package matches their needs, reference Hariel Xavier's brand expertise, and always use the exact package ID from the list above.`;

  try {
    const axiosResponse = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        messages: [
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
      }
    );

    if (axiosResponse.data && axiosResponse.data.content && axiosResponse.data.content.length > 0) {
      try {
        const responseText = axiosResponse.data.content[0].text;
        // Try to parse JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const recommendation = JSON.parse(jsonMatch[0]) as PackageRecommendation;
          res.status(200).json({ data: recommendation });
        } else {
          // Fallback if JSON parsing fails
          const fallbackRecommendation: PackageRecommendation = {
            recommendedPackage: 'duo-sussex-storyteller',
            confidence: 85,
            reasoning: 'Based on your preferences, the Sussex Storyteller Duo offers excellent value with comprehensive coverage and engagement session included.',
            suggestedAddOns: [],
            personalizedMessage: responseText
          };
          res.status(200).json({ data: fallbackRecommendation });
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        // Provide fallback recommendation
        const fallbackRecommendation: PackageRecommendation = {
          recommendedPackage: 'duo-sussex-storyteller',
          confidence: 80,
          reasoning: 'The Sussex Storyteller Duo is our most popular choice and offers great value with comprehensive coverage for most couples.',
          suggestedAddOns: [],
          personalizedMessage: "I'd love to discuss how we can make your wedding photography perfect for you!"
        };
        res.status(200).json({ data: fallbackRecommendation });
      }
    } else {
      console.error("Anthropic API returned an unexpected response structure:", axiosResponse.data);
      res.status(500).json({ error: "Anthropic API returned an unexpected response structure." });
    }
  } catch (error: any) {
    console.error("Error calling Anthropic API:", error.response?.data || error.message);
    let errorMessage = "Failed to get a recommendation from Sarah AI.";
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      errorMessage = `Sarah AI Error: ${error.response.data.error.message}`;
    } else if (error.message) {
      errorMessage = `Sarah AI Error: ${error.message}`;
    }
    res.status(500).json({ error: errorMessage });
  }
}

async function handleGeneralSuggestion(req: functions.Request, res: functions.Response, requestData: any) {
  const { userInput: clientAnswersString } = requestData;

  if (!clientAnswersString) {
    console.error("Invalid arguments received:", { clientAnswersString });
    res.status(400).json({ error: "Invalid arguments. 'userInput' (string of answers) is required." });
    return;
  }

  // Construct a detailed prompt for Claude with comprehensive package knowledge
  let prompt = `You are Sarah, the AI wedding photography consultant for Hariel Xavier Photography - a luxury wedding photography studio based in Sparta, NJ, known for capturing timeless love stories with artistic elegance and modern sophistication.

HARIEL XAVIER PHOTOGRAPHY BRAND IDENTITY:
- Lead photographer: Mauricio Fernandez with 14+ years of professional wedding photography experience
- 300+ weddings captured with artistic excellence by Mauricio
- Preferred photographer at The Club at Picatinny (exclusive venue partnership)
- Specializes in both intimate elopements and grand celebrations
- Known for natural light mastery, genuine emotions, and thoughtful composition
- Serves all of New Jersey and destination weddings
- Commitment to creating heirloom-quality memories that will be cherished for generations

A potential client has provided the following detailed information about their wedding plans and preferences:
${clientAnswersString}

COMPLETE HARIEL XAVIER PHOTOGRAPHY COLLECTION LINEUP:

**ELOPEMENT COLLECTIONS** (Perfect for intimate celebrations):

**The Intimate** - $1,595 ($133/month)
• 3 hours of heartfelt coverage
• 200+ professionally edited, high-resolution images
• 10 breathtaking sneak peeks within 24 hours
• Travel within 25 miles of Sparta, NJ included
• Perfect for: City hall vows, cozy backyard ceremonies, charming micro-venues

**The Adventure** - $2,195 ($183/month) [MOST POPULAR ELOPEMENT]
• 4 hours of adventurous coverage
• 300+ professionally edited, high-resolution images
• 15 stunning sneak peeks within 12 hours
• Travel within 50 miles of Sparta, NJ included
• Location scouting assistance for epic backdrops
• Perfect for: Breathtaking beach elopements, majestic mountain vows, unique destination spots

**The Escape** - $2,895 ($241/month)
• 6 hours of immersive coverage (ceremony + celebration)
• 400+ professionally edited, high-resolution images
• 20 captivating sneak peeks within 6 hours
• Travel within 100 miles of Sparta, NJ included
• Complimentary mini engagement session
• Perfect for: Romantic weekend getaways, multi-location elopement stories

**SINGLE PHOTOGRAPHER WEDDING COLLECTIONS**:

**The Sparta Sparkler** - $2,795 ($233/month)
• 8 hours of continuous coverage by Mauricio Fernandez
• 500+ meticulously edited, high-resolution images
• 10 exciting sneak peek images within 48 hours
• Complimentary engagement session at local Sparta, NJ location
• Full printing and personal use rights
• Perfect for: Essential, beautiful coverage capturing the heart of your Sparta wedding

**The Xavier Classic** - $3,295 ($275/month)
• 9 hours of comprehensive coverage by Mauricio Fernandez
• 600+ artistically edited, high-resolution images
• 15 captivating sneak peek images within 24-48 hours
• $150 credit towards fine art prints or products
• Choice of location for engagement session (within Sussex County)
• Perfect for: A classic, enhanced experience for memorable wedding days

**DUO COVERAGE WEDDING COLLECTIONS** (Two photographers for complete coverage):

**Sussex Storyteller Duo** - $3,995 ($333/month) [MOST POPULAR OVERALL]
• 9 hours with Mauricio Fernandez & skilled second photographer
• 700+ stunningly edited, high-resolution images from multiple perspectives
• Simultaneous coverage of bride & groom preparations
• 20 breathtaking sneak peek images within 24 hours
• $200 credit towards luxurious albums or wall art
• Full engagement session at Sussex County location
• Perfect for: Medium to large weddings wanting comprehensive coverage

**Skylands Signature Duo** - $5,495 ($458/month)
• 10 hours with Mauricio Fernandez, second photographer & dedicated assistant
• 900+ masterfully edited, high-resolution images
• Next-day 'mini-movie' sneak peek (30-60s social media teaser)
• Premium engagement session (extended time, multiple locations/outfits)
• Custom-designed 10x10 Fine Art Wedding Album (20 pages/40 sides)
• $400 credit towards albums, prints, or wall art
• Lifetime secure online gallery hosting
• Perfect for: Large weddings, luxury venues, premium experience

**LUXURY EXPERIENCE**:

**The Xavier Xperience** - $7,995+ (Ultimate luxury)
• Full Weekend Coverage: 12 hours wedding day + 3 hours rehearsal dinner
• Elite Team: Mauricio Fernandez, expert second photographer, dedicated lighting assistant
• 1200+ meticulously edited, magazine-quality images
• Same-Day Slideshow: Curated images showcased at reception
• Next-Day 'First Look' Gallery: 50-75 images immediately
• Cinematic Highlight Film (5-7 minutes) by dedicated film team
• Luxury Heirloom Collection: Bespoke 12x12 Album, 2 Parent Albums, Fine Art Print Box
• Exclusive Engagement Xperience: Styled session with hair & makeup consultation
• $750 credit towards statement wall art or album upgrades
• Perfect for: Luxury weddings, multi-day celebrations, discerning couples

**ADD-ONS AVAILABLE**:
• Wedding Film Package: $2,200 (8h filmmaker, 5-7 min highlight film, drone footage)
• Same-Day Reception Slideshow: $500
• Drone Photo/Video: $400
• Additional Photography Hours: $350/hour (lead), $200/hour (second)
• Rush Editing (2 weeks): $500

Based on the client's information, act as Sarah - a knowledgeable luxury wedding consultant who truly understands the Hariel Xavier Photography brand and serves as their trusted guide.

CONSULTATION APPROACH - ELOPEMENT PRIORITY:

**ELOPEMENT IDENTIFICATION (MUST RECOMMEND ELOPEMENT PACKAGES):**
- Under 50 guests mentioned
- 3-6 hours of coverage requested
- Words like "intimate," "small," "adventure," "elopement" used
- Budget under $3,000
- Outdoor/adventure venue mentioned

**ELOPEMENT PACKAGE MATCHING:**
- 3-4 hours = "The Adventure" ($2,195, 4 hours) - PERFECT for 4-hour requests
- 5-6 hours = "The Escape" ($2,895, 6 hours)
- Very intimate/budget = "The Intimate" ($1,595, 3 hours)

**TRADITIONAL WEDDING PACKAGES ONLY FOR:**
- 50+ guests AND 8+ hours explicitly mentioned
- Large celebration with dual coverage needs

**BRAND INTEGRATION:**
- Reference Mauricio Fernandez's 14+ years of experience and artistic approach
- Mention the exclusive Picatinny Club partnership when relevant
- Emphasize the heirloom quality and generational value of the photography

FORMAT YOUR RESPONSE WITH HARIEL XAVIER BRAND ELEGANCE:
1. Personal greeting that references their specific celebration type and vision
2. **Recommended Collection:** [Package Name] - **$[Price]** with monthly option
3. Why this perfectly suits your vision - Connect to their style and guest count
4. **Mauricio's Artistic Approach:** How his 14+ years of experience serves their vision
5. Signature elements that create heirloom memories (2-3 key features)
6. Investment guidance if budget doesn't align (guide them thoughtfully)

BRAND VOICE GUIDELINES:
- Speak as Sarah, but reference Mauricio's expertise and artistic vision
- Use sophisticated, warm language that feels like a trusted friend's advice
- Focus on the artistry, experience, and generational value
- Mention specific brand elements (natural light mastery, genuine emotions, thoughtful composition)
- For elopements, emphasize the intimate, adventurous, and romantic aspects
- For larger weddings, emphasize comprehensive coverage and artistic storytelling
- Use minimal bold formatting for elegance - only for package names and prices

ALWAYS END WITH:
"Mauricio and I would love to discuss how we can perfectly craft this experience for your celebration.

**Would you like to schedule a personal consultation with Mauricio?**
[Book your call here: https://calendly.com/harielxavierphotography/hariel-xavier-photography-meeting]

Or would you prefer to explore our complete collection or connect through our contact form below?

Looking forward to creating something extraordinary together."

CRITICAL: Always properly evaluate if this is an elopement scenario and recommend elopement collections when appropriate. Don't default to traditional wedding packages for intimate celebrations.
`;

  try {
    const axiosResponse = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages: [
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
      }
    );

    if (axiosResponse.data && axiosResponse.data.content && axiosResponse.data.content.length > 0) {
      res.status(200).json({ data: { suggestion: axiosResponse.data.content[0].text } });
    } else {
      console.error("Anthropic API returned an unexpected response structure:", axiosResponse.data);
      res.status(500).json({ error: "Anthropic API returned an unexpected response structure." });
    }
  } catch (error: any) {
    console.error("Error calling Anthropic API:", error.response?.data || error.message);
    let errorMessage = "Failed to get a suggestion from Sarah AI.";
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      errorMessage = `Sarah AI Error: ${error.response.data.error.message}`;
    } else if (error.message) {
      errorMessage = `Sarah AI Error: ${error.message}`;
    }
    res.status(500).json({ error: errorMessage });
  }
}