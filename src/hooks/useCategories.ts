import { useState, useEffect } from 'react';

export interface ApiCategoryFull {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<ApiCategoryFull[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json() as Promise<ApiCategoryFull[]>)
      .then((data) => setCategories(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
