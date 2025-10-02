// backend/server.ts

import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { generateIdPhoto, generateCartoonIdPhotoFromText } from './geminiService.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.use((req: Request, res: Response, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - startedAt}ms)`
    );
  });
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('AI 서버가 성공적으로 실행 중입니다! 🚀');
});

// 1. 텍스트로 새 이미지 생성
app.post('/api/generate-cartoon', async (req: Request, res: Response) => {
  try {
    console.log('generate-cartoon:',req.body);
    const { prompt, aspectRatio } = req.body;
    if (!prompt || !aspectRatio) {
      return res.status(400).json({ error: '프롬프트와 비율이 필요합니다.' });
    }
    const resultBase64 = await generateCartoonIdPhotoFromText(prompt, aspectRatio);
    console.log('generate-cartoon 응답 길이:', resultBase64.length);
    res.status(200).json({ success: true, base64Image: resultBase64 });
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류';
    res.status(500).json({ success: false, error: message });
  }
});

// 2. 이미지와 텍스트로 수정
app.post('/api/generate-id-photo', async (req: Request, res: Response) => {
  try {
    
    const { base64ImageData, mimeType, prompt } = req.body;
    if (!base64ImageData || !mimeType || !prompt) {
      return res.status(400).json({ error: '이미지, 타입, 프롬프트가 필요합니다.' });
    }
    const resultBase64 = await generateIdPhoto(base64ImageData, mimeType, prompt);
    console.log('generate-id-photo 응답 길이:', resultBase64.length);
    res.status(200).json({ success: true, base64Image: resultBase64 });
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류';
    res.status(500).json({ success: false, error: message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 백엔드 서버가 http://localhost:${PORT} 에서 실행 준비를 마쳤습니다.`);
});
