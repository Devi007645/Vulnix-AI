import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for demo purposes
// In a real app, this would be a database
let chatHistory: any[] = [];
let openAIKey: string | null = process.env.OPENAI_API_KEY || null;

app.get('/api/key-configured', (req, res) => {
  res.json({ configured: !!openAIKey });
});

app.post('/api/key', (req, res) => {
  const { key } = req.body;
  if (!key) {
    return res.status(400).json({ error: 'Key is required' });
  }
  openAIKey = key;
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

  if (!openAIKey) {
    // Mock response if no key
    const mockResponse = `I'm in mock mode because no OpenAI API key is configured. You said: "${prompt}". Please set your API key in Settings to get real AI responses.`;
    const aiMsg = {
      role: 'assistant',
      content: mockResponse,
      timestamp: Date.now()
    };
    chatHistory.push(aiMsg);
    return res.json({ content: mockResponse });
  }

  try {
    const openai = new OpenAI({ apiKey: openAIKey });
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are Vulnix AI, a world-class cybersecurity assistant.' },
        ...chatHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: prompt }
      ],
      model: 'gpt-3.5-turbo',
    });

    const aiResponse = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    const aiMsg = {
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now()
    };
    chatHistory.push(aiMsg);
    res.json({ content: aiResponse });
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: error.message || 'Error calling OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`Vulnix AI Backend listening at http://localhost:${port}`);
});
