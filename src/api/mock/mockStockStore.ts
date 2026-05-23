const stockMap = new Map<string, number>();

export const mockStockStore = {
  init(products: { id: string; stock: number }[]): void {
    products.forEach((p) => {
      if (!stockMap.has(p.id)) stockMap.set(p.id, p.stock);
    });
  },

  get: (productId: string): number => stockMap.get(productId) ?? 0,

  getAll: (): Record<string, number> => Object.fromEntries(stockMap),

  set: (productId: string, stock: number): number => {
    const next = Math.max(0, stock);
    stockMap.set(productId, next);
    return next;
  },

  decrement: (productId: string, qty = 1): number => {
    const current = mockStockStore.get(productId);
    return mockStockStore.set(productId, current - qty);
  },
};
