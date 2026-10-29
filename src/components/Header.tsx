import React from 'react';
import { ShoppingBag, ArrowLeft, Search, X, ShieldCheck, MapPin } from 'lucide-react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  cartCount: number;
  onNavigate: (page: Page) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  cartCount,
  onNavigate,
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
}) => {
  const isBackAvailable = currentPage !== 'catalog';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top info bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 font-medium">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Город:</span>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-white font-semibold cursor-pointer outline-hidden hover:text-amber-400 transition-colors"
            >
              <option value="Алматы" className="text-slate-900">Алматы</option>
              <option value="Астана" className="text-slate-900">Астана</option>
              <option value="Шымкент" className="text-slate-900">Шымкент</option>
              <option value="Караганда" className="text-slate-900">Караганда</option>
              <option value="Актобе" className="text-slate-900">Актобе</option>
            </select>
          </div>
          <div className="flex items-center gap-1 text-slate-400 hidden xs:flex">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Оригинальная техника с гарантией</span>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {isBackAvailable && (
            <button
              onClick={() => onNavigate(currentPage === 'thank-you' ? 'catalog' : 'catalog')}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition"
              title="Назад в каталог"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-amber-500 transition-colors">
              Q
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                Qazaq<span className="text-amber-600">Store</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                интернет-магазин ₸
              </span>
            </div>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button
            onClick={() => onNavigate('cart')}
            className={`relative p-2.5 rounded-xl border transition-all flex items-center gap-2 active:scale-95 ${
              currentPage === 'cart'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
            }`}
            title="Корзина"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-bold hidden sm:inline">Корзина</span>
            {cartCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-amber-500 text-slate-950 text-[11px] font-black shadow-xs animate-in zoom-in-75">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick search bar (only on catalog page) */}
      {currentPage === 'catalog' && (
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск смартфонов, наушников, часов..."
              className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-10 py-2.5 border border-transparent focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-hidden transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
