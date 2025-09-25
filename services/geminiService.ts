
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateIdPhoto(base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const imagePart = response?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (imagePart?.inlineData) {
      return imagePart.inlineData.data;
    }

    if (response && typeof response === 'object' && !response.candidates && !response.promptFeedback) {
        console.error("Received a non-standard or error response from Gemini API:", JSON.stringify(response, null, 2));
        const errorMessage = (response as any).error?.message || response.text || "The API returned an unexpected response structure.";
        throw new Error(`AI API 오류: ${errorMessage}`);
    }
    
    const blockReason = response?.promptFeedback?.blockReason;
    if (blockReason) {
      const reasonMessage = `이미지 생성 요청이 안전상의 이유로 거부되었습니다: ${blockReason}. 다른 사진이나 문구를 사용해 보세요.`;
      throw new Error(reasonMessage);
    }

    const textResponse = response.text;
    if (textResponse) {
      console.warn("API returned text instead of an image:", textResponse);
      throw new Error(`AI가 이미지를 생성하지 못했습니다: ${textResponse}`);
    }

    console.error("Unexpected API response. Full response:", JSON.stringify(response, null, 2));
    throw new Error("API에서 유효한 이미지를 반환하지 않았습니다. 응답이 비어 있습니다.");

  } catch (error) {
    console.error("Error generating ID photo with Gemini API:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("이미지 생성 중 알 수 없는 오류가 발생했습니다. 네트워크 연결을 확인해주세요.");
  }
}


export async function generateCartoonIdPhotoFromText(
  prompt: string, 
  aspectRatio: '1:1' | '3:4' | '9:16'
): Promise<string> {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    }

    // Fix: Removed check for `promptFeedback` as it does not exist on the `GenerateImagesResponse` type.
    // The function will now fall back to a generic error if no images are generated.
    
    console.error("Unexpected API response from generateImages. Full response:", JSON.stringify(response, null, 2));
    throw new Error("API에서 유효한 이미지를 반환하지 않았습니다. 응답이 비어 있습니다.");

  } catch (error) {
    console.error("Error generating cartoon ID photo with Gemini API:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("이미지 생성 중 알 수 없는 오류가 발생했습니다.");
  }
}
