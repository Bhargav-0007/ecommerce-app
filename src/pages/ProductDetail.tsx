import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Skeleton } from '../components/ui/Skeleton';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { useUiStore } from '../store/uiStore';
import { ROUTES } from '../constants/theme';

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-600">
        {rating.toFixed(1)} · {count.toLocaleString()} reviews
      </span>
    </div>
  );
}

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const { product, loading, error } = useProduct(slug);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUiStore((s) => s.addToast);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
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
      },
      qty
    );
    addToast('success', `${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="container-max py-8">
        <div className="flex flex-col md:flex-row gap-10">
          <Skeleton className="w-full md:w-1/2 aspect-square rounded-2xl" />
          <div className="flex-1 space-y-4 pt-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-max py-24 text-center">
        <p className="text-2xl font-semibold text-gray-700">
          {error === 'Product not found' ? 'Product not found' : 'Failed to load product'}
        </p>
        <p className="text-gray-400 mt-2 mb-6">
          {error === 'Product not found'
            ? 'This product may have been removed or the URL is incorrect.'
            : 'Make sure the backend server is running on port 3001.'}
        </p>
        <Link to={ROUTES.PRODUCTS} className="btn-primary inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const outOfStock = product.stock === 0;

  return (
    <div className="container-max py-6">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: product.category.name, href: `/products?category=${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="flex flex-col md:flex-row gap-10 mt-6">
        {/* ── Images ── */}
        <div className="w-full md:w-1/2 space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {product.images[activeImg] ? (
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImg ? 'border-primary-500' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Details ── */}
        <div className="flex-1 space-y-5">
          <div>
            <Link
              to={`/products?category=${product.category.slug}`}
              className="text-xs font-semibold uppercase tracking-widest text-primary-600 hover:text-primary-700"
            >
              {product.brand} · {product.category.name}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 leading-tight">
              {product.name}
            </h1>
          </div>

          <StarRating rating={product.rating} count={product.reviewCount} />

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {discount && (
              <span className="bg-accent-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-lg">
                Save {discount}%
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="text-sm">
            {outOfStock ? (
              <span className="text-red-500 font-medium">Out of stock</span>
            ) : product.stock <= 10 ? (
              <span className="text-orange-500 font-medium">
                Only {product.stock} left in stock — order soon
              </span>
            ) : (
              <span className="text-green-600 font-medium">In stock</span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          {!outOfStock && (
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-gray-900 min-w-[3rem] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary text-center"
              >
                Add to Cart
              </button>
            </div>
          )}

          {outOfStock && (
            <button disabled className="w-full btn-primary opacity-50 cursor-not-allowed">
              Out of Stock
            </button>
          )}

          <Link
            to={ROUTES.CART}
            className="block w-full btn-secondary text-center"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
