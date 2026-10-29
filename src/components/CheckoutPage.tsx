import React, { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Phone,
  User,
  MapPin,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { CartItem, CheckoutForm, CompletedOrder, Page } from '../types';
import { formatTenge } from '../data/products';
import {
  TOKEN,
  CHAT_ID,
  formatTelegramOrderMessage,
} from '../services/telegram';

interface CheckoutPageProps {
  cart: CartItem[];
  onNavigate: (page: Page) => void;
  onOrderSuccess: (order: CompletedOrder) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  onNavigate,
  onOrderSuccess,
}) => {
  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    phone: '+7 ',
    address: '',
    comment: '',
    deliveryType: 'courier',
    paymentMethod: 'kaspi',
  });

  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const itemsTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryCost = itemsTotal >= 25000 || form.deliveryType === 'pickup' ? 0 : 1500;
  const grandTotal = itemsTotal + deliveryCost;

  // Validation
  const isNameValid = form.name.trim().length >= 2;
  // Valid phone if has digits >= 10
  const digitsOnly = form.phone.replace(/\D/g, '');
  const isPhoneValid = digitsOnly.length >= 10;

  const handlePhoneChange = (val: string) => {
    // Keep it friendly for user typing
    setForm((prev) => ({ ...prev, phone: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true });

    if (!isNameValid || !isPhoneValid) {
      setErrorMessage('Пожалуйста, заполните обязательные поля: имя и номер телефона.');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Ваша корзина пуста. Добавьте товары перед оформлением.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const now = new Date();
    const dateFormatted = now.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const telegramMessage = formatTelegramOrderMessage({
      items: cart,
      total: grandTotal,
      customer: form,
      date: dateFormatted,
    });

    try {
      // Send Telegram message strictly according to specifications:
      // fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", { method: "POST", body: new URLSearchParams({ chat_id: CHAT_ID, text: message }) })
      // Do not add custom headers.
      const response = await fetch(
        "https://api.telegram.org/bot" + TOKEN + "/sendMessage",
        {
          method: "POST",
          body: new URLSearchParams({
            chat_id: CHAT_ID,
            text: telegramMessage,
          }),
        }
      );

      const data = await response.json();

      if (data && data.ok === true) {
        // Order successfully sent to Telegram
        const completedOrder: CompletedOrder = {
          orderId: `KZ-${Math.floor(100000 + Math.random() * 900000)}`,
          items: [...cart],
          total: grandTotal,
          customer: { ...form },
          date: dateFormatted,
        };

        onOrderSuccess(completedOrder);
      } else {
        const errorDetail = data?.description || 'Telegram API отклонил запрос';
        setErrorMessage(
          `Не удалось отправить заказ в Telegram (${errorDetail}). Проверьте настройки или повторите попытку.`
        );
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Сетевой сбой';
      setErrorMessage(
        `Ошибка соединения при отправке заказа: ${errorMsg}. Пожалуйста, повторите попытку.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-32 sm:pb-16">
      {/* Back button */}
      <button
        onClick={() => onNavigate('cart')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 mb-4 px-3 py-2 rounded-xl bg-white border border-slate-200/80 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Назад в корзину</span>
      </button>

      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-5">
        Оформление заказа
      </h1>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold mb-0.5">Ошибка при отправке заказа</div>
            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Customer contacts */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-4 text-sm font-extrabold text-slate-900">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Контактные данные</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ваше имя <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    placeholder="Например: Алишер"
                    className={`w-full bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-3 border transition outline-hidden ${
                      touched.name && !isNameValid
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:border-amber-500 focus:bg-white'
                    }`}
                  />
                </div>
                {touched.name && !isNameValid && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">
                    Пожалуйста, укажите ваше имя
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Номер телефона <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                    placeholder="+7 (701) 123-45-67"
                    className={`w-full bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-3 border transition outline-hidden ${
                      touched.phone && !isPhoneValid
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:border-amber-500 focus:bg-white'
                    }`}
                  />
                </div>
                {touched.phone && !isPhoneValid && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">
                    Укажите корректный номер телефона для связи
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  На этот номер придет подтверждение и позвонит курьер
                </p>
              </div>
            </div>
          </div>

          {/* 2. Delivery options */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-4 text-sm font-extrabold text-slate-900">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>Способ доставки</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, deliveryType: 'courier' }))}
                className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  form.deliveryType === 'courier'
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Truck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Курьерская доставка</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    До двери в Алматы, Астане и по РК
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, deliveryType: 'pickup' }))}
                className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  form.deliveryType === 'pickup'
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Building2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Самовывоз (Бесплатно)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Шоурум в Алматы, пр. Абая 44
                  </div>
                </div>
              </button>
            </div>

            {/* Address Field */}
            {form.deliveryType === 'courier' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Адрес доставки
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    placeholder="Город, улица, номер дома, квартира/офис"
                    className="w-full bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-3 border border-slate-200 focus:border-amber-500 focus:bg-white transition outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Comment Field */}
            <div className="mt-4 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Комментарий к заказу (необязательно)
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <textarea
                  rows={2}
                  value={form.comment}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="Код домофона, удобное время звонка или пожелания"
                  className="w-full bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-amber-500 focus:bg-white transition outline-hidden resize-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment notice */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-3 text-sm font-extrabold text-slate-900">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>Оплата при получении (Без предоплаты)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Kaspi QR или наличными при встрече с курьером</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Вы проверяете устройство перед оплатой. Никаких списаний прямо сейчас — мы свяжемся с вами в Telegram для подтверждения доставки.
              </p>
            </div>
          </div>
        </div>

        {/* Right sidebar: Order summary */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 h-fit shadow-xs">
          <h2 className="text-base font-extrabold text-slate-900 mb-3">
            Ваш заказ
          </h2>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 mb-4">
            {cart.map((item) => (
              <div
                key={`${item.product.id}_${item.selectedColor || ''}`}
                className="py-2.5 flex items-center justify-between text-xs gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-50 shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 truncate">
                      {item.product.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.quantity} шт. {item.selectedColor ? `· ${item.selectedColor}` : ''}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-slate-900 shrink-0">
                  {formatTenge(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100 mb-5">
            <div className="flex justify-between">
              <span>Сумма товаров:</span>
              <span className="font-semibold text-slate-900">{formatTenge(itemsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Доставка:</span>
              <span className="font-semibold text-slate-900">
                {deliveryCost === 0 ? (
                  <span className="text-emerald-600 font-bold">Бесплатно</span>
                ) : (
                  formatTenge(deliveryCost)
                )}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
              <span className="text-sm font-extrabold text-slate-900">Итого:</span>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                {formatTenge(grandTotal)}
              </span>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 active:scale-98 shadow-md disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Отправка заказа...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Оформить заказ</span>
              </>
            )}
          </button>

          <div className="mt-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Уведомление поступит менеджеру в Telegram</span>
          </div>
        </div>
      </form>
    </div>
  );
};
