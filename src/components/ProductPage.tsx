import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  Zap,
  Plus,
  Minus,
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { formatTenge } from '../data/products';

interface ProductPageProps {
  product: Product;
  cart: CartItem[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string) => void;
  onBuyNow: (product: Product, quantity: number, selectedColor?: string) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  cart,
  onBack,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const images = product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[selectedImageIndex] || product.image;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity, selectedColor);
  };

  return (
    <div className="pb-32 sm:pb-16 max-w-4xl mx-auto px-4 py-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 mb-4 px-3 py-2 rounded-xl bg-white border border-slate-200/80 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Назад в каталог</span>
      </button>

      {/* Product Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
        {/* Left Column: Image Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center p-4 mb-3">
            {product.tag && (
              <span className="absolute top-3 left-3 z-10 bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-md shadow-xs">
                {product.tag}
              </span>
            )}
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center rounded-xl transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all p-0.5 shrink-0 bg-slate-50 ${
                    selectedImageIndex === idx
                      ? 'border-amber-500 shadow-xs'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} preview ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Actions */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Category & Status */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-amber-600">
                {product.categoryLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                <Check className="w-3.5 h-3.5" />
                <span>В наличии в Алматы</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800">{product.rating}</span>
              </div>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-medium">
                {product.reviewsCount} отзывов покупателей
              </span>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {formatTenge(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm sm:text-base text-slate-400 line-through">
                    {formatTenge(product.oldPrice)}
                  </span>
                )}
              </div>
              {product.oldPrice && (
                <div className="text-xs font-semibold text-emerald-600 mt-1">
                  Экономия {formatTenge(product.oldPrice - product.price)}
                </div>
              )}
            </div>

            {/* Color selection if available */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Цвет: <span className="text-amber-700 normal-case">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Количество:
              </span>
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/80">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-slate-200 transition active:scale-95 shadow-2xs"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-slate-200 transition active:scale-95 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold transition flex items-center justify-center gap-2 active:scale-95 border border-slate-200/70"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>В корзину</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-sm font-bold transition flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Оформить заказ</span>
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
            <div className="p-2">
              <Truck className="w-4 h-4 mx-auto text-amber-600 mb-1" />
              <div className="text-[11px] font-bold text-slate-800">Доставка 1-2 дня</div>
              <div className="text-[10px] text-slate-400">по всему Казахстану</div>
            </div>
            <div className="p-2">
              <ShieldCheck className="w-4 h-4 mx-auto text-amber-600 mb-1" />
              <div className="text-[11px] font-bold text-slate-800">Гарантия 1 год</div>
              <div className="text-[10px] text-slate-400">официальный сервис</div>
            </div>
            <div className="p-2">
              <RotateCcw className="w-4 h-4 mx-auto text-amber-600 mb-1" />
              <div className="text-[11px] font-bold text-slate-800">14 дней возврат</div>
              <div className="text-[10px] text-slate-400">без лишних вопросов</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specifications */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
            Описание товара
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-6">
            {product.description}
          </p>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
            Характеристики
          </h2>
          <div className="divide-y divide-slate-100">
            {product.specs.map((spec, i) => (
              <div key={i} className="py-2.5 flex items-start justify-between text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">{spec.label}</span>
                <span className="text-slate-900 font-semibold text-right max-w-[60%]">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment info card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 h-fit">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Условия покупки
          </h3>
          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>
                <strong>Kaspi QR и наличные:</strong> оплата при получении курьеру после проверки товара.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>
                <strong>Быстрое подтверждение:</strong> после отправки заказа мы связываемся в Telegram или по звонку.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>
                <strong>100% Оригинал:</strong> новые запечатанные устройства с гарантией.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200 p-3 sm:hidden shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-500 font-medium">Цена за {quantity} шт:</div>
            <div className="text-base font-black text-slate-900">
              {formatTenge(product.price * quantity)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              className="py-2.5 px-3.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-900 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>В корзину</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold transition active:scale-95 shadow-md flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Оформить</span>
            </button>
          </div>
        </div>
      </div>

      {/* Added to cart toast notification */}
      {addedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Товар добавлен в корзину!</span>
        </div>
      )}
    </div>
  );
};
