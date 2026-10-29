import React from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { CartItem, Page } from '../types';
import { formatTenge } from '../data/products';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number, selectedColor?: string) => void;
  onRemoveItem: (productId: string, selectedColor?: string) => void;
  onClearCart: () => void;
  onNavigate: (page: Page) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) => {
  const itemsTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryThreshold = 25000;
  const isFreeDelivery = itemsTotal >= deliveryThreshold || itemsTotal === 0;
  const deliveryCost = isFreeDelivery ? 0 : 1500;
  const grandTotal = itemsTotal + deliveryCost;

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl mx-auto flex items-center justify-center text-slate-400 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">
          В вашей корзине пока пусто
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-xs mx-auto leading-relaxed">
          Выберите понравившиеся товары в каталоге, чтобы оформить заказ с быстрой доставкой по Казахстану.
        </p>
        <button
          onClick={() => onNavigate('catalog')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-amber-500 hover:text-slate-950 transition active:scale-95 shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Перейти в каталог</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-32 sm:pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Корзина
          </h1>
          <span className="text-xs text-slate-500 font-medium">
            {cart.reduce((s, i) => s + i.quantity, 0)} товаров на сумму{' '}
            <strong className="text-slate-900">{formatTenge(itemsTotal)}</strong>
          </span>
        </div>

        <button
          onClick={onClearCart}
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition p-2 rounded-lg hover:bg-rose-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Очистить</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => {
            const itemKey = `${item.product.id}_${item.selectedColor || ''}`;
            const lineTotal = item.product.price * item.quantity;

            return (
              <div
                key={itemKey}
                className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 flex gap-3 sm:gap-4 items-center justify-between shadow-2xs hover:border-slate-300 transition"
              >
                {/* Product thumbnail */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {item.product.name}
                  </h3>
                  {item.selectedColor && (
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Цвет: <span className="text-slate-800">{item.selectedColor}</span>
                    </div>
                  )}
                  <div className="text-xs font-extrabold text-slate-900 mt-1">
                    {formatTenge(item.product.price)}
                  </div>
                </div>

                {/* Actions: Stepper and Remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition rounded-md"
                    title="Удалить товар"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.product.id, -1, item.selectedColor)
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-slate-200 active:scale-95 transition shadow-2xs"
                      title="Уменьшить"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-bold text-xs text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.product.id, 1, item.selectedColor)
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-slate-200 active:scale-95 transition shadow-2xs"
                      title="Увеличить"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-xs font-extrabold text-slate-900 sm:hidden">
                    {formatTenge(lineTotal)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Delivery threshold bar */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 flex items-center gap-3">
            <Truck className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              {itemsTotal >= deliveryThreshold ? (
                <span className="font-semibold text-emerald-800">
                  Поздравляем! Вам доступна бесплатная доставка по Казахстану.
                </span>
              ) : (
                <span>
                  Добавьте товаров еще на{' '}
                  <strong>{formatTenge(deliveryThreshold - itemsTotal)}</strong> для
                  бесплатной доставки.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 h-fit shadow-xs">
          <h2 className="text-base font-extrabold text-slate-900 mb-4">
            Сумма заказа
          </h2>

          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span>Товары ({cart.reduce((s, i) => s + i.quantity, 0)} шт.)</span>
              <span className="font-semibold text-slate-900">
                {formatTenge(itemsTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Доставка</span>
              <span className="font-semibold text-slate-900">
                {deliveryCost === 0 ? (
                  <span className="text-emerald-600 font-bold">Бесплатно</span>
                ) : (
                  formatTenge(deliveryCost)
                )}
              </span>
            </div>
          </div>

          <div className="pt-4 mb-6">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm font-bold text-slate-900">Итого:</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatTenge(grandTotal)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Без скрытых комиссий • Оплата при получении
            </p>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 active:scale-98 shadow-md cursor-pointer"
          >
            <span>Перейти к оформлению</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className="w-full mt-2.5 py-2.5 text-center text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            Продолжить покупки
          </button>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Безопасное оформление без предоплаты</span>
          </div>
        </div>
      </div>
    </div>
  );
};
