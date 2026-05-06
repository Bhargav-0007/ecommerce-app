import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import type { ApiProduct } from '../../hooks/useProducts';

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= full
              ? 'text-yellow-400'
              : star === full + 1 && half
              ? 'text-yellow-300'
              : 'text-gray-200'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface ProductCardProps {
  product: ApiProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUiStore((s) => s.addToast);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice ?? undefined,
      images: product.images,
      brand: product.brand,
      rating: product.rating,
      reviewCount: product.reviewCount,
      stock: product.stock,
      featured: product.featured,
      tags: [],
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        image: '',
        description: '',
        productCount: 0,
      },
    });
    addToast('success', `${product.name} added to cart`);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="card group flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {discount && !outOfStock && (
          <span className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
            -{discount}%
          </span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-1.5">
        <p className="text-xs text-primary-600 font-medium uppercase tracking-wide truncate">
          {product.brand}
        </p>
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {product.name}
        </p>

        <StarRating rating={product.rating} />
        <p className="text-xs text-gray-400">{formatCount(product.reviewCount)} reviews</p>

        {lowStock && (
          <p className="text-xs text-orange-500 font-medium">Only {product.stock} left!</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-base font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="shrink-0 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
