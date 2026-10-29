export const TOKEN = "9104241600:AAFp2SQ2PTh4L1mh-2Xy_b8xlFMWBPHX668";
export const CHAT_ID = "1060199610";

import { CartItem, CheckoutForm } from '../types';
import { formatTenge } from '../data/products';

export interface TelegramSendResult {
  ok: boolean;
  description?: string;
}

export function formatTelegramOrderMessage({
  items,
  total,
  customer,
  date,
}: {
  items: CartItem[];
  total: number;
  customer: CheckoutForm;
  date: string;
}): string {
  const itemsText = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name}${
          item.selectedColor ? ` [${item.selectedColor}]` : ''
        } — ${item.quantity} шт. × ${formatTenge(item.product.price)} = ${formatTenge(
          item.product.price * item.quantity
        )}`
    )
    .join('\n');

  const addressText = customer.address?.trim()
    ? customer.address.trim()
    : customer.deliveryType === 'pickup'
    ? 'Самовывоз из шоурума (г. Алматы)'
    : 'Адрес не указан';

  const commentText = customer.comment?.trim()
    ? customer.comment.trim()
    : 'Нет комментария';

  return `🛒 Новый заказ

Товары:
${itemsText}

Итого: ${formatTenge(total)}

Имя: ${customer.name.trim()}
Телефон: ${customer.phone.trim()}
Адрес: ${addressText}
Комментарий: ${commentText}

Дата и время: ${date}`;
}

export async function sendOrderToTelegram(message: string): Promise<TelegramSendResult> {
  try {
    const response = await fetch(
      "https://api.telegram.org/bot" + TOKEN + "/sendMessage",
      {
        method: "POST",
        body: new URLSearchParams({
          chat_id: CHAT_ID,
          text: message,
        }),
      }
    );

    const data = await response.json();
    if (data && data.ok === true) {
      return { ok: true };
    }

    return {
      ok: false,
      description: data?.description || 'Telegram API вернул ошибку при создании заказа',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Сетевая ошибка';
    return {
      ok: false,
      description: `Ошибка отправки: ${errorMsg}`,
    };
  }
}
