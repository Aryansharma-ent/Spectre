import { GoogleGenerativeAI } from "@google/generative-ai";

const api = process.env.GEMINI_API_KEY;


export const genAiFixSuggestion = async (elementSelector: string, outerHtml: string, description: string) => {
    try {
        
        
        const api = process.env.GEMINI_API_KEY;
        if (!api ) {
            return {
                explanation: "Gemini API Key is not configured in the backend .env file.",
                cssFix: "/* Configure GEMINI_API_KEY in .env to get live recommendations */"
            };
        }
        
        
        const genAI = new GoogleGenerativeAI(api);  
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const prompt = `
You are an expert Frontend CSS Layout Debugger. 
A visual regression tool detected a layout bug on a website.
Below are the details of the broken HTML element:
- CSS Selector: ${elementSelector}
- HTML Snippet: ${outerHtml}
- Mismatch Size: ${description}

Analyze why the layout is misaligned and suggest the exact CSS code block to fix it.

Your response must be in strict JSON format matching the following keys:
{
  "explanation": "Brief 1-2 sentence explanation of why the layout shifted or color misaligned.",
  "cssFix": "The exact CSS code block to copy-paste (including selector and overrides) to fix the layout."
}
Return ONLY the raw JSON string. Do not wrap your response in markdown code blocks like \`\`\`.
`;

 const result = await model.generateContent(prompt)
 const text = result.response.text()

 const cleanedText = text.replace(/```json|```/g, '').trim();
 const parsed = JSON.parse(cleanedText);

 return {
  explanation: parsed.explanation,
  cssFix: parsed.cssFix
};


    } catch (error) {
        console.error("Gemini API Error:", error);
     return {
    explanation: "Failed to generate styling suggestion due to an API error.",
    cssFix: `error`
    };
    }
}