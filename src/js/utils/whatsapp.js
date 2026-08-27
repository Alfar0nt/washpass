import { formatCurrency } from './formatters.js';

let WHATSAPP_NUMBER = '6281234567890'; // Ganti dengan nomor WA bisnis

export function getWhatsAppNumber() {
  return WHATSAPP_NUMBER;
}

export function setWhatsAppNumber(number) {
  WHATSAPP_NUMBER = number;
}

export function generateWhatsAppMessage(orderData) {
  const { customer, items, totalPrice, totalItems, latitude, longitude } = orderData;
  
  let message = `🧼 *PESANAN BARU — WashPass*\n\n`;
  
  message += `👤 *Nama:* ${customer.name}\n`;
  message += `📱 *WhatsApp:* ${customer.whatsapp}\n`;
  message += `📍 *Alamat Pickup:* ${customer.address}\n`;
  if (customer.address_note) {
    message += `📝 *Catatan:* ${customer.address_note}\n`;
  }
  if (latitude && longitude) {
    message += `📌 *Lokasi GPS:* ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n`;
  }
  
  message += `\n━━━━━━━━━━━━━━━━━━\n\n`;
  message += `📦 *Detail Pesanan:*\n\n`;
  
  items.forEach((item, index) => {
    const materialLabel = getMaterialLabel(item.material);
    const washTypeLabel = item.wash_type === 'fast-clean' ? 'Cuci Kering (Fast Clean)' : 'Cuci Basah (Deep Clean)';
    
    message += `${index + 1}. ${item.category === 'shoe' ? 'Sepatu' : 'Sandal'}`;
    if (item.category === 'shoe') message += ` — ${materialLabel}`;
    message += `\n`;
    message += `   🧹 Tipe: ${washTypeLabel}\n`;
    message += `   💰 Harga: ${formatCurrency(item.price)}`;
    if (item.quantity > 1) message += ` x${item.quantity}`;
    message += `\n`;
    if (item.photos && item.photos.length > 0) {
      message += `   📸 Foto: ${item.photos.length} foto terlampir\n`;
    }
    if (item.notes) {
      message += `   📝 Catatan: ${item.notes}\n`;
    }
    message += `\n`;
  });
  
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  message += `💰 *Total: ${formatCurrency(totalPrice)}*\n`;
  message += `📦 *Jumlah Item: ${totalItems} pasang*\n\n`;
  message += `Terima kasih telah memesan di WashPass! 🙏\n\n`;
  message += `Tim kami akan menghubungi Anda via WhatsApp untuk konfirmasi jadwal pickup.`;
  
  return message;
}

export function redirectToWhatsApp(message) {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

export function submitOrderAndRedirect(orderData) {
  const message = generateWhatsAppMessage(orderData);
  redirectToWhatsApp(message);
}

function getMaterialLabel(material) {
  const labels = {
    'canvas': 'Kanvas / Textile',
    'mesh-knit': 'Mesh / Knit',
    'leather': 'Kulit Asli / Sintetis',
    'suede-nubuck': 'Suede / Nubuck',
    'rubber-eva': 'Karet / EVA / Foam',
  };
  return labels[material] || material;
}