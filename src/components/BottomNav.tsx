import React from 'react';
import { Store, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  cartCount: number;
  onNavigate: (page: Page) => void;
  onOpenInfo: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPage,
  cartCount,
  onNavigate,
  onOpenInfo,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] sm:hidden">
      <div className="max-w-md mx-auto grid grid-cols-3 h-15 items-center px-2">
        {/* Catalog */}
        <button
          onClick={() => onNavigate('catalog')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentPage === 'catalog' || currentPage === 'product'
              ? 'text-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[11px] leading-none">Каталог</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => onNavigate('cart')}
          className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
            currentPage === 'cart' || currentPage === 'checkout'
              ? 'text-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] leading-none">Корзина</span>
        </button>

        {/* Delivery / Info */}
        <button
          onClick={onOpenInfo}
          className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Truck className="w-5 h-5" />
          <span className="text-[11px] leading-none">Доставка</span>
        </button>
      </div>
    </nav>
  );
};
