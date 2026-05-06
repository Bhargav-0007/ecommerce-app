import { useState, useEffect } from 'react';
import { PRODUCTS_PER_PAGE } from '../constants/theme';
import { apiUrl } from '../lib/api';

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  category: ApiCategory;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
}

export interface ProductsPage {
  content: ApiProduct[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

interface UseProductsParams {
  category?: string;
  q?: string;
  page?: number;
  sortBy?: string;
  sortDir?: string;
}

export function useProducts({
  category,
  q,
  page = 0,
  sortBy = 'name',
  sortDir = 'asc',
}: UseProductsParams = {}) {
  const [data, setData] = useState<ProductsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (q) params.set('q', q);
    params.set('page', String(page));
    params.set('size', String(PRODUCTS_PER_PAGE));
    params.set('sortBy', sortBy);
    params.set('sortDir', sortDir);

    fetch(apiUrl(`/api/products?${params}`))
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load products');
        return r.json() as Promise<ProductsPage>;
      })
      .then((json) => setData(json))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category, q, page, sortBy, sortDir]);

  return { data, loading, error };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    fetch(apiUrl(`/api/products/${slug}`))
      .then((r) => {
        if (r.status === 404) throw new Error('Product not found');
        if (!r.ok) throw new Error('Failed to load product');
        return r.json() as Promise<ApiProduct>;
      })
      .then((json) => setProduct(json))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}
