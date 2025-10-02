// frontend/services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

export type ImageGenerationPayload = {
  base64Image: string;
  base64Length: number;
  mimeType: string;
  prompt: string;
  aspectRatio?: '3:4' | '1:1' | '9:16';
  generatedAt: string;
};

// 요청을 보내고 공통적으로 응답을 처리하는 헬퍼 함수
async function fetchApi<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message || '서버에서 응답 오류가 발생했습니다.');
  }
  return response.json();
}

// 1. 텍스트로 새 이미지를 생성하는 API 호출 함수
export async function generateNewPhoto(prompt: string, aspectRatio: '3:4' | '1:1' | '9:16') {
  const response = await fetchApi<ImageGenerationPayload>('/api/generate-cartoon', { prompt, aspectRatio });
  return response.data;
}

// 2. 기존 이미지를 수정하는 API 호출 함수
export async function refineExistingPhoto(base64Image: string, mimeType: string, prompt: string) {
  const response = await fetchApi<ImageGenerationPayload>('/api/generate-id-photo', { 
    base64ImageData: base64Image, 
    mimeType: mimeType,
    prompt: prompt 
  });
  return response.data;
}
