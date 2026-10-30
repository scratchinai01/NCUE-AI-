import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// API route for live generation
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: '請提供提示詞 (Prompt)' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: '系統目前未設定 GEMINI_API_KEY。您仍可點擊「一鍵複製」，前往 ChatGPT、Claude 或 Gemini 貼上使用！'
      });
    }

    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || '你是一位具備多年台灣師資培育輔導經驗的資深教育專家。請依據 108 課綱與台灣教育實務規範，以嚴謹、溫暖且結構完整的繁體中文輸出高質量的教學成果。',
      },
    });

    return res.json({ text: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    const rawMsg = error?.message || '';
    let friendlyMsg = 'AI 生成服務目前無法直接連線。請點擊「一鍵複製 Prompt」，前往 ChatGPT、Claude 或 Google Gemini 貼上使用！';
    
    if (rawMsg.includes('ACCOUNT_STATE_INVALID') || rawMsg.includes('deleted or disabled') || rawMsg.includes('UNAUTHENTICATED')) {
      friendlyMsg = '目前環境之 API 金鑰憑證尚未啟動或受限。建議您點擊「一鍵複製 Prompt」，直接在 ChatGPT、Claude 或 Gemini 貼上即可獲得完整成果！';
    }

    return res.status(500).json({
      error: friendlyMsg
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

async function startServer() {
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
