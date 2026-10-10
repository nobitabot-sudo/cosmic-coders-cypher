import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// ================= FIREBASE SERVER-SIDE SETUP =================
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig, 'server');
const fdb = getFirestore(firebaseApp);

// ================= GEMINI SETUP =================
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    })
  : null;

// ================= FIRESTORE DATA FETCHERS =================

async function fetchStoreData(storeId: string) {
  // Fetch store
  const storeDoc = await getDoc(doc(fdb, 'stores', storeId));
  const store = storeDoc.exists() ? { id: storeDoc.id, ...storeDoc.data() } : null;

  // Fetch products
  const productsSnap = await getDocs(query(collection(fdb, 'products'), where('storeId', '==', storeId)));
  const products: any[] = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Fetch orders
  const ordersSnap = await getDocs(query(collection(fdb, 'orders'), where('storeId', '==', storeId)));
  const orders: any[] = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Fetch memberships for this store
  const membershipsSnap = await getDocs(query(collection(fdb, 'memberships'), where('storeId', '==', storeId)));
  const memberships = membershipsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  return { store, products, orders, memberships };
}

function computeInsights(products: any[], orders: any[]) {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;

  const lowStockItems = products
    .filter(p => (p.stock ?? 0) < 10)
    .map(p => ({ name: p.name, stock: p.stock, price: p.price }));

  const outOfStock = products.filter(p => (p.stock ?? 0) === 0).length;

  const orderCounts: Record<string, number> = {
    PLACED: 0, PACKED: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0
  };
  orders.forEach(o => {
    if (o.status in orderCounts) orderCounts[o.status]++;
  });

  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((s, o) => s + (Number(o.total) || 0), 0);

  const thisWeekOrders = orders.filter(o => new Date(o.createdAt).getTime() > now - week && o.status !== 'CANCELLED');
  const lastWeekOrders = orders.filter(o => {
    const t = new Date(o.createdAt).getTime();
    return t > now - 2 * week && t <= now - week && o.status !== 'CANCELLED';
  });

  const thisWeekRevenue = thisWeekOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const lastWeekRevenue = lastWeekOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const percentChange = lastWeekRevenue > 0
    ? `${(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100).toFixed(1)}%`
    : 'N/A';

  // Top products
  const productSales: Record<string, { name: string; units: number }> = {};
  thisWeekOrders.forEach(o => {
    (o.items || []).forEach((it: any) => {
      const key = it.productId;
      if (!productSales[key]) productSales[key] = { name: it.name, units: 0 };
      productSales[key].units += it.qty || 0;
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(o => ({
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
    }));

  return {
    lowStockItems,
    outOfStock,
    orderCounts,
    totalRevenue,
    totalOrders: orders.length,
    thisWeekRevenue,
    lastWeekRevenue,
    percentChange,
    topProducts,
    recentOrders,
  };
}

// ================= CHATBOT API =================
app.post('/api/ai/chat', async (req, res) => {
  const { storeId, userId, query: userQuery } = req.body;

  if (!userQuery) {
    return res.status(400).json({ error: 'Query is required' });
  }
  if (!storeId || !userId) {
    return res.status(400).json({ error: 'storeId and userId required' });
  }

  try {
    // SERVER-SIDE VERIFICATION: Check user owns this store
    const { store, products, orders, memberships } = await fetchStoreData(storeId);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const hasAccess = memberships.some((m: any) => m.userId === userId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'You do not have access to this store' });
    }

    const insights = computeInsights(products, orders);

    // If Gemini available, use it
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const systemInstruction = `You are a store assistant for the e-commerce store "${store.name}".
Only answer using the real store data provided below.
If the data does not contain the answer, respond EXACTLY: "I don't have that data."
NEVER invent numbers. NEVER reference other stores.
Keep answers concise, use bullet points, and format currency in Indian Rupees (₹).`;

        const contextPrompt = `REAL STORE DATA for "${store.name}":

📦 Catalog:
- Total products: ${products.length}
- Active products: ${products.filter((p: any) => p.isActive !== false).length}
- Low stock (≤10 units): ${insights.lowStockItems.length}
- Out of stock: ${insights.outOfStock}
- Low stock items: ${JSON.stringify(insights.lowStockItems)}

🧾 Orders:
- Total orders: ${insights.totalOrders}
- By status: ${JSON.stringify(insights.orderCounts)}
- Total revenue: ₹${insights.totalRevenue.toFixed(0)}

📈 Revenue Comparison:
- This week: ₹${insights.thisWeekRevenue.toFixed(0)} (${insights.thisWeekRevenue > 0 ? 'has data' : 'no orders'})
- Last week: ₹${insights.lastWeekRevenue.toFixed(0)}
- Change: ${insights.percentChange}

🔥 Top Selling (this week):
${insights.topProducts.map(p => `- ${p.name}: ${p.units} units`).join('\n') || 'No sales this week'}

🕐 Recent Orders:
${insights.recentOrders.map(o => `- #${o.orderNumber} ${o.customerName} ₹${o.total} [${o.status}]`).join('\n') || 'No orders'}

User Question: "${userQuery}"`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-exp',
          contents: contextPrompt,
          config: { systemInstruction, temperature: 0.1 }
        });

        const text = response.text?.trim() || "I don't have that data.";
        return res.json({
          answer: text,
          dataUsed: {
            productsCount: products.length,
            ordersCount: orders.length,
            lowStockCount: insights.lowStockItems.length,
            revenue: insights.totalRevenue
          }
        });
      } catch (e: any) {
        console.warn('Gemini error:', e?.message);
        // Fall through to deterministic response
      }
    }

    // Fallback: deterministic answer based on data
    return res.json({
      answer: `I have data for ${products.length} products and ${insights.totalOrders} orders. Revenue: ₹${insights.totalRevenue.toFixed(0)}. Low stock items: ${insights.lowStockItems.length}. Please configure GEMINI_API_KEY for full AI responses.`,
      dataUsed: { productsCount: products.length, ordersCount: insights.totalOrders }
    });

  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Internal error', message: err.message });
  }
});

// ================= HEALTH CHECK =================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    uptime: process.uptime(),
    firebase: !!process.env.VITE_FIREBASE_PROJECT_ID,
    gemini: !!process.env.GEMINI_API_KEY,
  });
});

// ================= SERVER BOOT =================
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
    console.log(`Cypher Store Builder running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
