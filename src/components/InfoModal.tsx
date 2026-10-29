import React from 'react';
import { X, Truck, ShieldCheck, CreditCard, Clock, MapPin, Send } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-extrabold text-slate-900 mb-4">
          Доставка и оплата в г. {selectedCity}
        </h2>

        <div className="space-y-4 text-xs text-slate-600">
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <Truck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 mb-0.5">Курьерская доставка</div>
              <p>
                По {selectedCity} — в день заказа или на следующий день. По другим городам РК — 1–3 дня экспресс-службой.
              </p>
              <div className="mt-1 font-semibold text-emerald-700">
                Бесплатно при заказе от 25 000 ₸! (Иначе 1 500 ₸)
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <CreditCard className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 mb-0.5">Оплата без риска</div>
              <p>
                Оплата происходит только при получении товара. Вы можете осмотреть и проверить устройство, затем оплатить через Kaspi QR, карту или наличными.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 mb-0.5">Гарантия 12 месяцев</div>
              <p>
                Вся продукция 100% оригинальная, в заводской упаковке с официальной гарантией сервисных центров.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 mb-0.5">Шоурум и самовывоз</div>
              <p>
                г. Алматы, пр. Абая 44 (ст. метро Байконур). Работаем ежедневно с 10:00 до 20:00 без выходных.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
            <Send className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 mb-0.5">Мгновенный Telegram-бот</div>
              <p className="text-[11px]">
                Ваши заказы моментально отправляются дежурному менеджеру, чтобы исключить задержки в обработке.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
        >
          Понятно, спасибо
        </button>
      </div>
    </div>
  );
};
