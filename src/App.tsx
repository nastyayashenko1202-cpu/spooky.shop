/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const TOKEN = "9104241600:AAFp2SQ2PTh4L1mh-2Xy_b8xlFMWBPHX668";
export const CHAT_ID = "1060199610";

import React, { useState, useEffect } from 'react';
import { Product, CartItem, CompletedOrder, Page } from './types';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CatalogPage } from './components/CatalogPage';
import { ProductPage } from './components/ProductPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { ThankYouPage } from './components/ThankYouPage';
import { InfoModal } from './components/InfoModal';
import { Smartphone, Monitor } from 'lucide-react';

const CART_STORAGE_KEY = 'qazaq_store_cart';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<CompletedOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Алматы');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Initialize cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    }
    return [];
  });

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string
  ) => {
    setCart((prev) => {
      const color = selectedColor || (product.colors?.[0]?.name ?? undefined);
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          (item.selectedColor || '') === (color || '')
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor: color }];
      }
    });
  };

  const handleUpdateQuantity = (
    productId: string,
    delta: number,
    selectedColor?: string
  ) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          const isMatch =
            item.product.id === productId &&
            (selectedColor === undefined || item.selectedColor === selectedColor);

          if (isMatch) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveItem = (productId: string, selectedColor?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (selectedColor === undefined || item.selectedColor === selectedColor)
          )
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  const handleBuyNow = (
    product: Product,
    quantity = 1,
    selectedColor?: string
  ) => {
    handleAddToCart(product, quantity, selectedColor);
    setCurrentPage('checkout');
  };

  const handleOrderSuccess = (order: CompletedOrder) => {
    setLastOrder(order);
    handleClearCart();
    setCurrentPage('thank-you');
  };

  const totalCartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`min-h-screen bg-[#f8f9fb] text-slate-900 transition-all ${
        isPhoneFrame ? 'py-4 sm:py-8 flex flex-col items-center justify-center bg-slate-900' : ''
      }`}
    >
      {/* Desktop View Switcher Tool Bar (subtle helper) */}
      <div className="hidden lg:flex fixed top-3 right-4 z-50 items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-md border border-slate-200 text-xs font-semibold text-slate-600">
        <span className="text-[11px] text-slate-400 mr-1">Вид:</span>
        <button
          onClick={() => setIsPhoneFrame(false)}
          className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition ${
            !isPhoneFrame
              ? 'bg-slate-900 text-white shadow-xs'
              : 'hover:text-slate-900'
          }`}
          title="Широкий экран"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Адаптивный</span>
        </button>
        <button
          onClick={() => setIsPhoneFrame(true)}
          className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition ${
            isPhoneFrame
              ? 'bg-slate-900 text-white shadow-xs'
              : 'hover:text-slate-900'
          }`}
          title="Эмуляция мобильного экрана"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile-first</span>
        </button>
      </div>

      {/* Main app container: full width mobile or framed mobile */}
      <div
        className={`w-full transition-all ${
          isPhoneFrame
            ? 'max-w-[420px] bg-[#f8f9fb] min-h-[840px] rounded-[40px] shadow-2xl border-[10px] border-slate-800 overflow-hidden relative'
            : 'max-w-4xl mx-auto min-h-screen shadow-xs'
        }`}
      >
        {/* Header */}
        <Header
          currentPage={currentPage}
          cartCount={totalCartItemsCount}
          onNavigate={(page) => {
            if (page === 'catalog') {
              setSearchQuery('');
            }
            setCurrentPage(page);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
        />

        {/* Dynamic Page Views */}
        <main className="min-h-[75vh]">
          {currentPage === 'catalog' && (
            <CatalogPage
              products={PRODUCTS}
              cart={cart}
              searchQuery={searchQuery}
              onSelectProduct={handleSelectProduct}
              onAddToCart={(prod) => handleAddToCart(prod, 1)}
              onUpdateQuantity={handleUpdateQuantity}
              onOpenCart={() => setCurrentPage('cart')}
            />
          )}

          {currentPage === 'product' && selectedProduct && (
            <ProductPage
              product={selectedProduct}
              cart={cart}
              onBack={() => setCurrentPage('catalog')}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          )}

          {currentPage === 'cart' && (
            <CartPage
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'checkout' && (
            <CheckoutPage
              cart={cart}
              onNavigate={setCurrentPage}
              onOrderSuccess={handleOrderSuccess}
            />
          )}

          {currentPage === 'thank-you' && lastOrder && (
            <ThankYouPage
              order={lastOrder}
              onNavigate={setCurrentPage}
            />
          )}
        </main>

        {/* Mobile Fixed Bottom Navigation */}
        <BottomNav
          currentPage={currentPage}
          cartCount={totalCartItemsCount}
          onNavigate={(page) => {
            if (page === 'catalog') setSearchQuery('');
            setCurrentPage(page);
          }}
          onOpenInfo={() => setIsInfoModalOpen(true)}
        />

        {/* Footer info (Desktop & Tablet) */}
        <footer className="mt-12 border-t border-slate-200/80 bg-white py-8 px-6 text-center text-xs text-slate-500">
          <div className="font-extrabold text-sm text-slate-800 mb-1">
            QazaqStore Казахстан
          </div>
          <p className="max-w-md mx-auto text-slate-500 mb-3">
            Оригинальные гаджеты и аксессуары с официальной гарантией. Доставка по Алматы, Астане и регионам РК.
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>© 2026 QazaqStore</span>
            <span>·</span>
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="hover:text-slate-800 underline transition"
            >
              Условия доставки и оплаты
            </button>
            <span>·</span>
            <span>Цены в ₸</span>
          </div>
        </footer>

        {/* Info & Delivery Modal */}
        <InfoModal
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          selectedCity={selectedCity}
        />
      </div>
    </div>
  );
}
