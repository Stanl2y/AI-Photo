// server.ts

// 1. 필요한 모듈들을 ES Module 'import' 방식으로 가져옵니다.
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 2. geminiService.ts에서 만든 AI 함수들을 직접 import 합니다.
// ts-node가 알아서 이 타입스크립트 파일을 해석해줍니다.
import { 
  generateIdPhoto, 
  generateCartoonIdPhotoFromText 
} from './services/geminiService.ts';

// 3. dotenv를 실행하여 .env 파일의 환경변수를 로드합니다.
dotenv.config();

// 4. Express 앱을 생성하고 기본 설정을 합니다.
const app = express();
const PORT = process.env.PORT || 3001; // 서버 포트 설정

// 5. 미들웨어 설정
// CORS를 활성화하여 React 앱(보통 다른 포트에서 실행됨)의 요청을 허용합니다.
app.use(cors()); 
// 클라이언트가 보내는 JSON 형식의 요청 본문(body)을 서버가 이해할 수 있도록 파싱합니다.
// 이미지 데이터는 용량이 크므로, 한번에 받을 수 있는 데이터의 한도를 20MB로 늘립니다.
app.use(express.json({ limit: '20mb' }));

// 6. 서버가 정상적으로 실행 중인지 확인하는 테스트용 엔드포인트
app.get('/', (req: Request, res: Response) => {
  res.send('AI 증명사진 생성 서버가 성공적으로 실행 중입니다! 🚀');
});

// =============================================
// API 엔드포인트 (실제 기능이 동작하는 경로)
// =============================================

/**
 * @route   POST /api/generate-id-photo
 * @desc    이미지와 텍스트를 받아 새로운 이미지를 생성합니다.
 * @access  Public
 */
app.post('/api/generate-id-photo', async (req: Request, res: Response) => {
  try {
    // 클라이언트 요청의 body에서 필요한 데이터들을 추출합니다.
    const { base64ImageData, mimeType, prompt } = req.body;

    // 필수 데이터가 하나라도 없는 경우, 400 (Bad Request) 오류를 반환합니다.
    if (!base64ImageData || !mimeType || !prompt) {
      return res.status(400).json({ 
        success: false, 
        error: '필수 데이터(base64ImageData, mimeType, prompt)가 누락되었습니다.' 
      });
    }

    console.log('[/api/generate-id-photo] 이미지 생성을 시작합니다...');
    // geminiService에 있는 AI 함수를 호출하여 결과를 받습니다.
    const resultBase64 = await generateIdPhoto(base64ImageData, mimeType, prompt);
    console.log('[/api/generate-id-photo] 이미지 생성이 완료되었습니다.');
    
    // 성공적으로 처리되면, 생성된 이미지 데이터를 클라이언트에게 보냅니다.
    res.status(200).json({ success: true, base64Image: resultBase64 });

  } catch (error) {
    // AI 함수 또는 다른 과정에서 오류가 발생한 경우
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 서버 오류가 발생했습니다.';
    console.error('[/api/generate-id-photo] API 오류:', errorMessage);
    // 500 (Internal Server Error) 오류와 함께 에러 메시지를 클라이언트에게 전달합니다.
    res.status(500).json({ success: false, error: errorMessage });
  }
});

/**
 * @route   POST /api/generate-cartoon
 * @desc    텍스트 프롬프트를 받아 만화 스타일 이미지를 생성합니다.
 * @access  Public
 */
app.post('/api/generate-cartoon', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio } = req.body;

    if (!prompt || !aspectRatio) {
      return res.status(400).json({ 
        success: false, 
        error: '필수 데이터(prompt, aspectRatio)가 누락되었습니다.' 
      });
    }
    
    console.log('[/api/generate-cartoon] 이미지 생성을 시작합니다...');
    const resultBase64 = await generateCartoonIdPhotoFromText(prompt, aspectRatio);
    console.log('[/api/generate-cartoon] 이미지 생성이 완료되었습니다.');

    res.status(200).json({ success: true, base64Image: resultBase64 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 서버 오류가 발생했습니다.';
    console.error('[/api/generate-cartoon] API 오류:', errorMessage);
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// 7. 지정된 포트에서 서버 실행을 시작합니다.
app.listen(PORT, () => {
  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 준비 완료되었습니다.`);
  console.log('사용 가능한 API 엔드포인트:');
  console.log(`  - [POST] http://localhost:${PORT}/api/generate-id-photo`);
  console.log(`  - [POST] http://localhost:${PORT}/api/generate-cartoon`);
});