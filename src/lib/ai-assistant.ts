import { getProductsByStore, getOrdersByStore } from './storage';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  toolUsed?: string;
  data?: unknown;
}

// 1. getTopProducts(days, limit)
export function getTopProducts(storeId: string, days = 30, limit = 5) {
  const orders = getOrdersByStore(storeId);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const validOrders = orders.filter(o => o.status !== 'CANCELLED' && new Date(o.createdAt) >= cutoff);
  const salesMap = new Map<string, { name: string; qtySold: number; totalRevenue: number }>();

  for (const order of validOrders) {
    for (const item of order.items) {
      const existing = salesMap.get(item.productId) || {
        name: item.name,
        qtySold: 0,
        totalRevenue: 0
      };
      existing.qtySold += item.qty;
      existing.totalRevenue += item.price * item.qty;
      salesMap.set(item.productId, existing);
    }
  }

  const sorted = Array.from(salesMap.values())
    .sort((a, b) => b.qtySold - a.qtySold)
    .slice(0, limit);

  return {
    timeframeDays: days,
    topProducts: sorted
  };
}

// 2. getLowStock(threshold)
export function getLowStock(storeId: string, threshold = 10) {
  const products = getProductsByStore(storeId);
  const lowStock = products
    .filter(p => p.stock <= threshold)
    .sort((a, b) => a.stock - b.stock)
    .map(p => ({
      name: p.name,
      stock: p.stock,
      sku: p.sku,
      price: `₹${p.price.toLocaleString('en-IN')}`,
      status: p.stock === 0 ? 'Out of stock' : 'Low stock'
    }));

  return {
    threshold,
    count: lowStock.length,
    items: lowStock
  };
}

// 3. getRevenueComparison()
export function getRevenueComparison(storeId: string) {
  const orders = getOrdersByStore(storeId);
  const now = Date.now();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  const validOrders = orders.filter(o => o.status !== 'CANCELLED');

  const thisWeekOrders = validOrders.filter(o => {
    const time = new Date(o.createdAt).getTime();
    return time >= now - oneWeekMs;
  });

  const lastWeekOrders = validOrders.filter(o => {
    const time = new Date(o.createdAt).getTime();
    return time >= now - 2 * oneWeekMs && time < now - oneWeekMs;
  });

  const thisWeekRevenue = thisWeekOrders.reduce((sum, o) => sum + o.total, 0);
  const lastWeekRevenue = lastWeekOrders.reduce((sum, o) => sum + o.total, 0);

  const diff = thisWeekRevenue - lastWeekRevenue;
  const percentChange =
    lastWeekRevenue > 0
      ? Math.round((diff / lastWeekRevenue) * 100)
      : thisWeekRevenue > 0
      ? 100
      : 0;

  return {
    thisWeekRevenue: `₹${thisWeekRevenue.toLocaleString('en-IN')}`,
    lastWeekRevenue: `₹${lastWeekRevenue.toLocaleString('en-IN')}`,
    difference: `₹${diff.toLocaleString('en-IN')}`,
    percentChange: `${percentChange > 0 ? '+' : ''}${percentChange}%`,
    thisWeekOrderCount: thisWeekOrders.length,
    lastWeekOrderCount: lastWeekOrders.length
  };
}

// 4. getOrderStats()
export function getOrderStats(storeId: string) {
  const orders = getOrdersByStore(storeId);
  const stats = {
    PLACED: 0,
    PACKED: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
    total: orders.length,
    totalRevenue: orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.total, 0)
  };

  for (const o of orders) {
    if (stats[o.status] !== undefined) {
      stats[o.status]++;
    }
  }

  return {
    ...stats,
    formattedRevenue: `₹${stats.totalRevenue.toLocaleString('en-IN')}`
  };
}

// 5. getRecentOrders(limit)
export function getRecentOrders(storeId: string, limit = 5) {
  const orders = getOrdersByStore(storeId);
  const recent = orders.slice(0, limit).map(o => ({
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    itemsCount: o.items.reduce((sum, i) => sum + i.qty, 0),
    total: `₹${o.total.toLocaleString('en-IN')}`,
    status: o.status,
    createdAt: new Date(o.createdAt).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  return {
    recentOrders: recent
  };
}

// 6. getTotalProducts()
export function getTotalProducts(storeId: string) {
  const products = getProductsByStore(storeId);
  const active = products.filter(p => p.isActive).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;

  return {
    total: products.length,
    active,
    inactive: products.length - active,
    outOfStock,
    lowStock
  };
}

// Master query solver adhering strictly to the system prompt
export async function askStoreAssistant(
  storeId: string,
  userQuery: string
): Promise<{ text: string; toolUsed?: string; rawData?: unknown }> {
  // First try the server endpoint if available
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId,
        query: userQuery,
        clientData: {
          products: getTotalProducts(storeId),
          orders: getOrderStats(storeId),
          lowStock: getLowStock(storeId),
          topProducts: getTopProducts(storeId),
          revenueComparison: getRevenueComparison(storeId),
          recentOrders: getRecentOrders(storeId)
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.answer) {
        return {
          text: data.answer,
          toolUsed: data.toolUsed,
          rawData: data.toolData
        };
      }
    }
  } catch {
    // Fall back to robust direct client tool executor
  }

  // Exact deterministic tool-grounded response engine
  const q = userQuery.toLowerCase();

  // Match: Low stock
  if (q.includes('stock') || q.includes('inventory') || q.includes('running low') || q.includes('out of stock')) {
    const data = getLowStock(storeId, 10);
    if (data.items.length === 0) {
      return {
        text: 'All products currently have healthy inventory levels (more than 10 units in stock). No low-stock items detected.',
        toolUsed: 'getLowStock',
        rawData: data
      };
    }
    const lines = data.items.map(
      i => `• ${i.name} (${i.sku}): ${i.stock} units left [${i.status}] — Price: ${i.price}`
    );
    return {
      text: `Found ${data.count} product(s) with low stock (threshold: 10 units):\n\n${lines.join('\n')}`,
      toolUsed: 'getLowStock',
      rawData: data
    };
  }

  // Match: Revenue comparison
  if (q.includes('revenue') || q.includes('sales comparison') || q.includes('this week vs') || q.includes('earn')) {
    const data = getRevenueComparison(storeId);
    return {
      text: `Revenue comparison (This Week vs Last Week):\n• This Week: ${data.thisWeekRevenue} (${data.thisWeekOrderCount} orders)\n• Last Week: ${data.lastWeekRevenue} (${data.lastWeekOrderCount} orders)\n• Change: ${data.percentChange} (${data.difference})`,
      toolUsed: 'getRevenueComparison',
      rawData: data
    };
  }

  // Match: Top products
  if (q.includes('top') || q.includes('best seller') || q.includes('popular') || q.includes('selling')) {
    const data = getTopProducts(storeId, 30, 5);
    if (data.topProducts.length === 0) {
      return {
        text: "There are no completed sales recorded yet in the last 30 days to compute top selling products.",
        toolUsed: 'getTopProducts',
        rawData: data
      };
    }
    const lines = data.topProducts.map(
      (p, idx) => `${idx + 1}. ${p.name}: ${p.qtySold} sold (₹${p.totalRevenue.toLocaleString('en-IN')})`
    );
    return {
      text: `Top selling products in the last 30 days:\n\n${lines.join('\n')}`,
      toolUsed: 'getTopProducts',
      rawData: data
    };
  }

  // Match: Recent orders
  if (q.includes('recent order') || q.includes('latest order') || q.includes('orders today')) {
    const data = getRecentOrders(storeId, 5);
    if (data.recentOrders.length === 0) {
      return {
        text: 'No orders have been placed yet for this store.',
        toolUsed: 'getRecentOrders',
        rawData: data
      };
    }
    const lines = data.recentOrders.map(
      o => `• #${o.orderNumber} by ${o.customerName}: ${o.total} (${o.itemsCount} items) — [${o.status}] on ${o.createdAt}`
    );
    return {
      text: `Here are the 5 most recent orders:\n\n${lines.join('\n')}`,
      toolUsed: 'getRecentOrders',
      rawData: data
    };
  }

  // Match: Order stats
  if (q.includes('order stat') || q.includes('how many orders') || q.includes('status breakdown') || q.includes('fulfillment')) {
    const data = getOrderStats(storeId);
    return {
      text: `Order status summary:\n• Total Orders: ${data.total}\n• Total Revenue: ${data.formattedRevenue}\n• Placed: ${data.PLACED}\n• Packed: ${data.PACKED}\n• Shipped: ${data.SHIPPED}\n• Delivered: ${data.DELIVERED}\n• Cancelled: ${data.CANCELLED}`,
      toolUsed: 'getOrderStats',
      rawData: data
    };
  }

  // Match: Total products
  if (q.includes('how many product') || q.includes('catalog') || q.includes('total product')) {
    const data = getTotalProducts(storeId);
    return {
      text: `Catalog overview:\n• Total Products: ${data.total}\n• Active Listings: ${data.active}\n• Inactive: ${data.inactive}\n• Low Stock (<10): ${data.lowStock}\n• Out of Stock (0): ${data.outOfStock}`,
      toolUsed: 'getTotalProducts',
      rawData: data
    };
  }

  // Fallback as strictly demanded by system prompt:
  // "If you don't have the data, say exactly: 'I don't have that data.' NEVER invent numbers. NEVER reference other stores."
  return {
    text: "I don't have that data."
  };
}
