import React from 'react';
import {
  CheckCircle2,
  PackageCheck,
  Send,
  Phone,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CompletedOrder, Page } from '../types';
import { formatTenge } from '../data/products';

interface ThankYouPageProps {
  order: CompletedOrder;
  onNavigate: (page: Page) => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  order,
  onNavigate,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32 sm:pb-16 text-center">
      {/* Success Badge & Animation */}
      <div className="w-20 h-20 bg-emerald-100 rounded-3xl mx-auto flex items-center justify-center text-emerald-600 mb-5 shadow-inner">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
        <Send className="w-3.5 h-3.5" />
        <span>Уведомление отправлено в Telegram</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        Спасибо за заказ!
      </h1>
      <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
        Ваш заказ <strong className="text-slate-900">{order.orderId}</strong> принят в обработку. Менеджер свяжется с вами по указанному телефону в течение 10 минут.
      </p>

      {/* Order Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 text-left shadow-xs mb-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Номер заказа
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {order.orderId}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Дата и время
            </div>
            <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{order.date}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="py-4 border-b border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Получатель:</span>
            <span className="font-bold text-slate-900">{order.customer.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Телефон:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-600" />
              <span>{order.customer.phone}</span>
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-slate-500">Доставка:</span>
            <span className="font-medium text-slate-900 text-right">
              {order.customer.address ||
                (order.customer.deliveryType === 'pickup'
                  ? 'Самовывоз: г. Алматы, пр. Абая 44'
                  : 'Адрес будет уточнен')}
            </span>
          </div>
          {order.customer.comment && (
            <div className="flex items-start justify-between gap-4 pt-1">
              <span className="text-slate-500">Комментарий:</span>
              <span className="text-slate-700 text-right italic">
                «{order.customer.comment}»
              </span>
            </div>
          )}
        </div>

        {/* Ordered items */}
        <div className="py-4 border-b border-slate-100">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4 text-amber-600" />
            <span>Состав заказа:</span>
          </div>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1"
              >
                <div className="flex items-center gap-2 max-w-[70%]">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-8 h-8 rounded-md object-cover bg-slate-50 shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-slate-900 font-medium truncate block">
                      {item.product.name}
                    </span>
                    {item.selectedColor && (
                      <span className="text-[10px] text-slate-400">
                        {item.selectedColor}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-slate-500 text-[11px]">
                    {item.quantity} × {formatTenge(item.product.price)}
                  </div>
                  <div className="font-extrabold text-slate-900">
                    {formatTenge(item.product.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 flex items-baseline justify-between">
          <span className="text-sm font-bold text-slate-900">Итого к оплате:</span>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {formatTenge(order.total)}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Оплата при получении курьеру (Kaspi QR или наличные)
        </p>
      </div>

      {/* Return to shop */}
      <button
        onClick={() => onNavigate('catalog')}
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white rounded-xl text-sm font-extrabold transition-all active:scale-95 shadow-md cursor-pointer"
      >
        <span>Продолжить покупки в каталоге</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Гарантийный талон и чек будут приложены к заказу</span>
      </div>
    </div>
  );
};
