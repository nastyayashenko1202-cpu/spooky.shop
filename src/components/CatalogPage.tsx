import React, { useState, useMemo } from 'react';
import { Star, Plus, Minus, Check, ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Product, CartItem } from '../types';
import { CATEGORIES, formatTenge } from '../data/products';

interface CatalogPageProps {
  products: Product[];
  cart: CartItem[];
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onOpenCart: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  cart,
  searchQuery,
  onSelectProduct,
  onAddToCart,
  onUpdateQuantity,
  onOpenCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewsCount - a.reviewsCount; // popular
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Quick lookup for cart items
  const cartMap = useMemo(() => {
    const map = new Map<string, number>();
    cart.forEach((item) => {
      map.set(item.product.id, (map.get(item.product.id) || 0) + item.quantity);
    });
    return map;
  }, [cart]);

  return (
    <div className="pb-24 sm:pb-12">
      {/* Promo banner on top */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl mx-4 my-4 p-5 sm:p-7 relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Официальная гарантия 1 год</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
            Премиальная техника <br />
            <span className="text-amber-400">с доставкой по Казахстану</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Kaspi QR, наличные при получении. Доставка по Алматы в день заказа.
          </p>
        </div>
      </div>

      {/* Category horizontal scroll bar */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort & Count Bar */}
      <div className="px-4 mb-3 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span className="font-medium">
          Найдено: <strong className="text-slate-800">{filteredProducts.length}</strong>
        </span>

        <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-slate-700 font-semibold text-xs outline-hidden cursor-pointer"
          >
            <option value="popular">По популярности</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="rating">По рейтингу</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center my-6">
            <p className="text-base font-semibold text-slate-800 mb-1">Ничего не найдено</p>
            <p className="text-xs text-slate-500 mb-4">
              По запросу «{searchQuery}» ничего не найдено. Попробуйте изменить параметры поиска.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const qtyInCart = cartMap.get(product.id) || 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  {/* Top section: image & badge */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="cursor-pointer relative bg-slate-50 aspect-square overflow-hidden flex items-center justify-center p-3"
                  >
                    {product.tag && (
                      <span className="absolute top-2.5 left-2.5 z-10 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                        {product.tag}
                      </span>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 rounded-lg"
                      loading="lazy"
                    />
                  </div>

                  {/* Details section */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Rating and category */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {product.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-snug cursor-pointer hover:text-amber-600 transition-colors mb-2"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-2 border-t border-slate-100 mt-2">
                      <div className="mb-2">
                        <div className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                          {formatTenge(product.price)}
                        </div>
                        {product.oldPrice && (
                          <div className="text-[11px] text-slate-400 line-through">
                            {formatTenge(product.oldPrice)}
                          </div>
                        )}
                      </div>

                      {/* Add to Cart button / Stepper */}
                      {qtyInCart > 0 ? (
                        <div className="flex items-center justify-between bg-slate-100 rounded-xl p-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateQuantity(product.id, -1);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-slate-200 active:scale-95 transition shadow-2xs"
                            title="Уменьшить"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-slate-900 px-2">
                            {qtyInCart}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateQuantity(product.id, 1);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 active:scale-95 transition shadow-2xs"
                            title="Увеличить"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>В корзину</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating cart summary on mobile if cart has items */}
      {cart.length > 0 && (
        <div className="fixed bottom-18 left-4 right-4 z-20 sm:hidden">
          <button
            onClick={onOpenCart}
            className="w-full bg-slate-900 text-white rounded-2xl p-3.5 shadow-xl flex items-center justify-between border border-slate-700 active:scale-98 transition"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
              <span className="text-xs font-bold">Перейти в корзину</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-amber-400">
              <span>
                {formatTenge(
                  cart.reduce((s, i) => s + i.product.price * i.quantity, 0)
                )}
              </span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
