import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import scannerRouter from './services/vulnerability-scanner/router.js';
import { startScanWorker } from './workers/scanWorker.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/scans', scannerRouter);

// In-memory storage for demo purposes
// In a real app, this would be a database
let chatHistory: any[] = [];
let geminiKey: string | null = process.env.GEMINI_API_KEY || null;

app.get('/api/key-configured', (req, res) => {
  res.json({ configured: !!geminiKey });
});

app.post('/api/key', (req, res) => {
  const { key } = req.body;
  if (!key) {
    return res.status(400).json({ error: 'Key is required' });
  }
  geminiKey = key;
  res.json({ success: true });
});

app.get('/api/history', (req, res) => {
  res.json(chatHistory);
});

app.delete('/api/history', (req, res) => {
  chatHistory = [];
  res.json({ success: true });
});

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Save user message
  const userMsg = {
    role: 'user',
    content: prompt,
    timestamp: Date.now()
  };
  chatHistory.push(userMsg);

  if (!geminiKey) {
    // Mock response if no key
    const mockResponse = `I'm in mock mode because no Gemini API key is configured. You said: "${prompt}". Please set your API key in Settings to get real AI responses.`;
    const aiMsg = {
      role: 'assistant',
      content: mockResponse,
      timestamp: Date.now()
    };
    chatHistory.push(aiMsg);
    return res.json({ content: mockResponse });
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
      history: chatHistory.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(prompt);
    const aiResponse = result.response.text();

    const aiMsg = {
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now()
    };
    chatHistory.push(aiMsg);
    res.json({ content: aiResponse });
  } catch (error: any) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: error.message || 'Error calling Gemini' });
  }
});

// Start the background worker if requested
if (process.env.RUN_WORKER === 'true') {
  startScanWorker();
}

app.listen(port, () => {
  console.log(`Vulnix AI Backend listening at http://localhost:${port}`);
});
