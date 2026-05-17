import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/generate-questions', async (req, res) => {
    const { topic, target, atmosphere, count = 3 } = req.body;

    if (!topic || !target || !atmosphere) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const prompt = `
        당신은 기업교육 전문 퍼실리테이터입니다. 다음 정보를 기반으로 교육용 아이스브레이킹 질문 카드를 생성해주세요.
        
        [교육 정보]
        - 교육 주제: ${topic}
        - 학습 대상: ${target}
        - 워크숍 분위기: ${atmosphere}
        - 단계별 질문 개수: ${count}개 (총 ${count * 3}개)

        [단계별 가이드라인]
        1단계 (Ice-Breaking): 가볍고 유쾌하게 답할 수 있는 질문. 심리적 장벽 완화.
        2단계 (Theme Bridge): 오늘 교육 주제(${topic})와 연계된 가벼운 경험 공유.
        3단계 (Deep Connection): 가치관, 업무 지향점 등 깊이 있는 대화 유도.

        [출력 요구사항]
        - 질문은 50자 내외의 명확하고 직관적인 문장이어야 합니다.
        - 대상자(${target})와 분위기(${atmosphere})에 맞는 톤앤매너를 유지하세요.
        - 전체 워크숍을 위한 오프닝 멘트와 클로징 멘트, 그리고 운영 팁을 포함하세요.
      `;

      const schema = {
        type: Type.OBJECT,
        properties: {
          cards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                level: { type: Type.STRING, description: "1단계 / 2단계 / 3단계" },
                question: { type: Type.STRING },
                effect: { type: Type.STRING }
              },
              required: ["id", "level", "question", "effect"]
            }
          },
          opening: { type: Type.STRING },
          closing: { type: Type.STRING },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["cards", "opening", "closing", "tips"]
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (error: any) {
      console.error('Error generating questions:', error);
      res.status(500).json({ error: 'Failed to generate questions', details: error.message });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
