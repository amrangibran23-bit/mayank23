import { GoogleGenAI, Type, Modality } from '@google/genai';
import { PhotoAnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    isValid: {
      type: Type.BOOLEAN,
      description: "Whether the photo is valid as a passport photo."
    },
    issues: {
      type: Type.ARRAY,
      description: "A list of issues found with the photo. Should be empty if the photo is valid.",
      items: { type: Type.STRING }
    }
  },
  required: ['isValid', 'issues']
};

export const analyzePassportPhoto = async (imageBase64: string): Promise<PhotoAnalysisResult> => {
    const model = 'gemini-2.5-flash';
    const prompt = `Analyze this image to see if it meets standard passport photo requirements. Check for these specific criteria: 
    1. Background is neutral and plain (e.g., white or off-white).
    2. Lighting is even with no significant shadows on the face or background.
    3. The person's face is centered and looking directly at the camera.
    4. Eyes are open and clearly visible.
    5. The person has a neutral expression or a faint smile.
    6. No hats, sunglasses, or other objects obscuring the face.
    
    Respond ONLY with a JSON object that conforms to the provided schema. Be strict in your evaluation.`;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: imageBase64,
    },
  };

  const textPart = {
    text: prompt
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString) as PhotoAnalysisResult;
    return result;
  } catch (error) {
    console.error("Error analyzing photo with Gemini:", error);
    throw new Error("Failed to communicate with the AI analysis service.");
  }
};

export const enhancePhotoBackground = async (imageBase64: string, color: 'Red' | 'Blue' | 'White'): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    const prompt = `Replace the background of this portrait with a solid, plain, ${color.toLowerCase()} color suitable for an official ID photo. Ensure the subject's hair, clothing, and outline are preserved perfectly with no artifacts. The final image should only contain the person and the new plain background.`;

    const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg',
        },
      };

    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && firstPart.inlineData) {
            return firstPart.inlineData.data;
        } else {
            throw new Error("No image data returned from enhancement service.");
        }
    } catch (error) {
        console.error("Error enhancing photo background with Gemini:", error);
        throw new Error("Failed to communicate with the AI enhancement service.");
    }
};

export const changeCostume = async (imageBase64: string, costume: 'Kemeja Putih' | 'Jas Hitam'): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    
    let prompt: string;
    if (costume === 'Kemeja Putih') {
        prompt = "Digitally and realistically replace the clothing on the person in this photo with a formal white collared shirt, suitable for a professional ID photo. Preserve the person's head, face, and the existing background. The result should look natural and high-quality.";
    } else { // Jas Hitam
        prompt = "Digitally and realistically replace the clothing on the person in this photo with a formal black suit jacket over a white collared shirt, suitable for a professional ID photo. Preserve the person's head, face, and the existing background. The result should look natural and high-quality.";
    }

    const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg',
        },
      };

    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && firstPart.inlineData) {
            return firstPart.inlineData.data;
        } else {
            throw new Error("No image data returned from costume change service.");
        }
    } catch (error) {
        console.error("Error changing costume with Gemini:", error);
        throw new Error("Failed to communicate with the AI costume change service.");
    }
};
