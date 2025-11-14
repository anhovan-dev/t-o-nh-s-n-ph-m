import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { SocialContent, UploadedImage } from "../types";

export const generateProductImage = async (
  imageBase64: string,
  mimeType: string,
  prompt: string,
  characterImageBase64?: string | null,
  characterImageMimeType?: string | null
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const parts: any[] = [
    {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    },
  ];

  let textPrompt = `Your task is to create a new, photorealistic product photograph.
- **Product:** Use the exact product from the provided image.
- **Scene & Style:** Create the scene based on the following description: "${prompt}".
- **Important:** Do NOT use any product mentioned in the text description. You MUST replace it with the product from the image. The final image should be a seamless composition of the provided product within the described scene.`;

  if (characterImageBase64 && characterImageMimeType) {
    parts.push({
      inlineData: {
        data: characterImageBase64,
        mimeType: characterImageMimeType,
      },
    });
    textPrompt = `Your task is to create a new, photorealistic product photograph featuring a person.
- **Product:** Use the exact product from the first image.
- **Person:** Use the exact person from the second image.
- **Scene & Style:** Create the scene based on the following description: "${prompt}".
- **Important:** Do NOT use any product or person described in the text description. You MUST replace them with the product from the first image and the person from the second image. The final image should be a seamless composition of the provided product and person within the described scene.`;
  }
  
  parts.push({ text: textPrompt });


  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts,
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("No image was generated in the response.");
};


export const generateSocialContent = async (
  imageBase64: string,
  mimeType: string
): Promise<SocialContent> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        {
          text: "Based on the provided product image, generate the following content for a social media post in Vietnamese. Keep it concise, engaging, and professional. The product appears to be a perfume.",
        },
      ],
    },
    config: {
      systemInstruction: "You are an expert Vietnamese social media marketing manager specializing in creating compelling content for e-commerce products.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "A short, catchy title for the social media post.",
          },
          descriptionAndHashtags: {
            type: Type.STRING,
            description: "A compelling description of the product, followed by relevant hashtags on new lines.",
          },
          motionPrompt: {
            type: Type.STRING,
            description: "A descriptive prompt for creating a short, cinematic promotional video of the product.",
          },
        },
        required: ["title", "descriptionAndHashtags", "motionPrompt"],
      },
    },
  });

  try {
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as SocialContent;
  } catch (e) {
    console.error("Failed to parse JSON response:", response.text);
    throw new Error("Could not parse social content from API response.");
  }
};

export const generatePromptFromImages = async (
  productImage: UploadedImage,
  referenceImage: UploadedImage,
  characterImage: UploadedImage | null
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare image data for the API call
  const [productHeader, productBase64Data] = productImage.base64.split(',');
  const productMimeType = productHeader.match(/:(.*?);/)?.[1] || 'image/png';

  const [referenceHeader, referenceBase64Data] = referenceImage.base64.split(',');
  const referenceMimeType = referenceHeader.match(/:(.*?);/)?.[1] || 'image/png';
  
  if (!productBase64Data || !referenceBase64Data) {
      throw new Error("Invalid base64 string from one of the images.");
  }

  const parts: any[] = [
    {
      inlineData: {
        data: referenceBase64Data, // Reference image first, as it's the primary subject of analysis
        mimeType: referenceMimeType,
      },
    },
    {
      inlineData: {
        data: productBase64Data,
        mimeType: productMimeType,
      },
    },
  ];

  const systemInstruction = `You are an expert AI prompt engineer. Your task is to generate a high-quality, detailed prompt for an image generation model. You will be given a reference image for style, a product image, and sometimes a character image.

Your primary goal is to first inspect the reference image for any explicit text that is an AI prompt. This text is often labeled with the word "PROMPT".

- **Rule 1: If the reference image contains an explicit prompt text**, your ONLY job is to extract that prompt text accurately and return it. Do not include the heading 'PROMPT' or any other surrounding text. Just return the prompt text.
- **Rule 2: If the reference image does NOT contain an explicit prompt text**, then you must analyze the visual elements of all provided images. Generate a new, detailed, and descriptive English prompt. This new prompt should describe a photorealistic, professional product photograph that combines the product (and the character, if provided) into a scene that captures the style, mood, lighting, and composition of the reference image.
- **Rule 3: Your final output must ONLY be the prompt string.**`;

  let userPrompt = "First, check the reference image (the first image) for any text labeled 'PROMPT'. If it exists, extract and return that text. If not, analyze all images to generate a new prompt that combines the product from the second image into the style of the first image.";

  if (characterImage) {
    const [charHeader, charBase64Data] = characterImage.base64.split(',');
    const charMimeType = charHeader.match(/:(.*?);/)?.[1] || 'image/png';
    if (!charBase64Data) {
        throw new Error("Invalid base64 string from character image.");
    }

    parts.push({
      inlineData: {
        data: charBase64Data,
        mimeType: charMimeType,
      },
    });

    userPrompt = "First, check the reference image (the first image) for any text labeled 'PROMPT'. If it exists, extract and return that text. If not, analyze all images to generate a new prompt that combines the product from the second image and the person from the third image into the style of the first image.";
  }
  
  parts.push({ text: userPrompt });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts },
    config: {
        systemInstruction,
    },
  });

  return response.text;
};
