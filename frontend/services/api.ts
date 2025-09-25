// frontend/services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 요청을 보내고 공통적으로 응답을 처리하는 헬퍼 함수
async function fetchApi(endpoint: string, body: object) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '서버에서 응답 오류가 발생했습니다.');
  }
  return response.json();
}

// 1. 텍스트로 새 이미지를 생성하는 API 호출 함수
export async function generateNewPhoto(prompt: string, aspectRatio: '3:4' | '1:1' | '9:16') {
  return fetchApi('/api/generate-cartoon', { prompt, aspectRatio });
}

// 2. 기존 이미지를 수정하는 API 호출 함수
export async function refineExistingPhoto(base64Image: string, mimeType: string, prompt: string) {
  return fetchApi('/api/generate-id-photo', { 
    base64ImageData: base64Image, 
    mimeType: mimeType,
    prompt: prompt 
  });
}