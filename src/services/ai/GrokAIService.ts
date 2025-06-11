// We will use standard fetch instead of firebase functions sdk for onRequest type
// import { getFunctions, httpsCallable } from 'firebase/functions';
// import { app } from '../../firebase/config'; // Assuming your firebase app init is here

// Define the structure of the packages to be sent to the backend
// This should match the structure expected by your PricingPage and the Firebase Function
interface PricingPackageFeature {
  text: string;
  icon?: React.ElementType | string; // Allow string for icon name if not directly passing component
}

interface PricingPackage {
  id: string;
  name: string;
  price: string;
  monthlyPrice?: string;
  features: (string | PricingPackageFeature)[];
  popular?: boolean;
  tier?: 'elopement' | 'traditional' | 'premium' | 'luxury';
  usp?: string;
  perfectFor?: string[];
  themeColor?: string;
  textColor?: string;
}

// Define the expected response from the Firebase function
interface GrokSuggestionResponse {
  data: { // onRequest functions often wrap response in 'data' if called like a callable
    suggestion: string;
  };
  error?: string; // To catch potential error messages from the function
}

class GrokAIService {
  // Firebase project details - replace with your actual project ID and region if different
  private projectId = "harielxavierphotography-18d17";
  private region = "us-central1";
  private functionName = "getGrokPackageSuggestion";
  private functionUrl = `https://${this.region}-${this.projectId}.cloudfunctions.net/${this.functionName}`;

  constructor() {}

  /**
   * Gets a package suggestion from the Grok AI backend.
   * @param userInput - The user's description of their needs.
   * @param packages - An array of available photography packages.
   * @returns A promise that resolves with the AI's suggestion string.
   */
  async getAISuggestion(
    userInput: string,
    packages: PricingPackage[]
  ): Promise<string> {
    console.log("Calling getGrokPackageSuggestion (fetch) with:", { userInput, packages });
    console.log("Target URL:", this.functionUrl);

    try {
      const response = await fetch(this.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization header might be needed if your function requires it,
          // but for public access with CORS, it's often not for the preflight.
          // If using App Check, Firebase SDK handles token automatically.
          // For direct fetch, you might need to handle App Check token manually if enforced.
        },
        body: JSON.stringify({ data: { userInput, packages } }), // Emulate callable structure
      });

      console.log("Fetch response status:", response.status);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Firebase Function HTTP error:", response.status, errorBody);
        throw new Error(`Sarah AI service returned an error: ${response.status}. ${errorBody}`);
      }

      const result = await response.json() as GrokSuggestionResponse;
      console.log("Received from getGrokPackageSuggestion (fetch):", result);

      if (result.error) {
        console.error("Firebase Function returned an error in JSON:", result.error);
        throw new Error(`Sarah AI Error: ${result.error}`);
      }
      
      // The backend function wraps the suggestion in `data: { suggestion: ... }`
      if (result.data && result.data.suggestion) {
        return result.data.suggestion;
      } else {
        console.error("Unexpected response structure from Grok AI function:", result);
        throw new Error("Sarah AI returned an unexpected response. Please try again.");
      }

    } catch (error: any) {
      console.error("Error calling Grok AI Firebase Function (fetch):", error);
      throw new Error(`Sarah AI is currently unavailable. ${error.message || 'Please try again later.'}`);
    }
  }
}

export const grokAIService = new GrokAIService();
export type { PricingPackage as GrokServicePricingPackage }; // Export type for use in components
