import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with required headers
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

// POST /api/ai/chat - AI Store Assistant
app.post('/api/ai/chat', async (req, res) => {
  const { storeId, query, clientData } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // If Gemini API is available, generate response grounded on the store's actual live data
  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `You are a store assistant for an e-commerce platform.
Only answer using the store data provided in the context.
If you do not have the data to answer the query, say exactly: 'I don't have that data.'
NEVER invent numbers. NEVER reference other stores.
Keep answers concise, factual, and formatted with bullet points where appropriate. All prices are in Indian Rupees (₹).`;

      const prompt = `Current Store Live Data:
- Catalog Overview: Total ${clientData?.products?.total || 0} products (${clientData?.products?.active || 0} active, ${clientData?.products?.lowStock || 0} low stock <= 10 units, ${clientData?.products?.outOfStock || 0} out of stock).
- Low Stock Items: ${JSON.stringify(clientData?.lowStock?.items || [])}
- Order Fulfillment Breakdown: Total ${clientData?.orders?.total || 0} orders (Placed: ${clientData?.orders?.PLACED || 0}, Packed: ${clientData?.orders?.PACKED || 0}, Shipped: ${clientData?.orders?.SHIPPED || 0}, Delivered: ${clientData?.orders?.DELIVERED || 0}, Cancelled: ${clientData?.orders?.CANCELLED || 0}). Total revenue: ${clientData?.orders?.formattedRevenue || '₹0'}.
- Top Selling Products (Last 30 Days): ${JSON.stringify(clientData?.topProducts?.topProducts || [])}
- Revenue Comparison (This Week vs Last Week): This week: ${clientData?.revenueComparison?.thisWeekRevenue || '₹0'} (${clientData?.revenueComparison?.thisWeekOrderCount || 0} orders), Last week: ${clientData?.revenueComparison?.lastWeekRevenue || '₹0'} (${clientData?.revenueComparison?.lastWeekOrderCount || 0} orders), Change: ${clientData?.revenueComparison?.percentChange || '0%'}.
- Recent Orders: ${JSON.stringify(clientData?.recentOrders?.recentOrders || [])}

User Question: "${query}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.1
        }
      });

      const text = response.text?.trim() || "I don't have that data.";
      return res.json({ answer: text });
    } catch (e: any) {
      console.warn('Gemini generateContent error, falling back to deterministic response:', e?.message);
    }
  }

  // Deterministic fallback if API key is not present or rate limited
  return res.status(200).json({ answer: null });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mount Vite or serve static files
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cypher Store Builder server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
