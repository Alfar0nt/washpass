export function validateName(name) {
  if (!name || !name.trim()) {
    return { valid: false, message: 'Nama lengkap wajib diisi' };
  }
  if (name.trim().length < 2) {
    return { valid: false, message: 'Nama minimal 2 karakter' };
  }
  if (name.trim().length > 100) {
    return { valid: false, message: 'Nama terlalu panjang (maks 100 karakter)' };
  }
  return { valid: true };
}

export function validateWhatsApp(whatsapp) {
  if (!whatsapp || !whatsapp.trim()) {
    return { valid: false, message: 'Nomor WhatsApp wajib diisi' };
  }
  
  const cleaned = whatsapp.replace(/\s+/g, '');
  const indonesianPhoneRegex = /^(\+62|62|0)8[1-9]\d{7,10}$/;
  
  if (!indonesianPhoneRegex.test(cleaned)) {
    return { valid: false, message: 'Format nomor tidak valid. Contoh: 08xxxxxxxxxx atau +628xxxxxxxxxx' };
  }
  
  return { valid: true, cleaned: formatWhatsAppForAPI(cleaned) };
}

export function formatWhatsAppForAPI(whatsapp) {
  const cleaned = whatsapp.replace(/\D/g, '');
  if (cleaned.startsWith('62')) return cleaned;
  if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
  return '62' + cleaned;
}

export function formatWhatsAppForDisplay(whatsapp) {
  const cleaned = whatsapp.replace(/\D/g, '');
  if (cleaned.startsWith('62')) return '+62 ' + cleaned.slice(2).replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
  if (cleaned.startsWith('0')) return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  return whatsapp;
}

export function validateAddress(address) {
  if (!address || !address.trim()) {
    return { valid: false, message: 'Alamat pickup wajib diisi' };
  }
  if (address.trim().length < 10) {
    return { valid: false, message: 'Alamat terlalu pendek. Masukkan alamat lengkap (jalan, RT/RW, kelurahan, kecamatan, kota)' };
  }
  if (address.trim().length > 500) {
    return { valid: false, message: 'Alamat terlalu panjang (maks 500 karakter)' };
  }
  return { valid: true };
}

export function validateAddressNote(note) {
  if (note && note.trim().length > 300) {
    return { valid: false, message: 'Catatan alamat terlalu panjang (maks 300 karakter)' };
  }
  return { valid: true };
}

export function validateMinItems(itemCount, min = 2) {
  if (itemCount < min) {
    return { valid: false, message: `Minimal order ${min} pasang. Saat ini ${itemCount} pasang.` };
  }
  return { valid: true };
}

export function validateEmail(email) {
  if (!email || !email.trim()) return { valid: true };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: 'Format email tidak valid' };
  }
  return { valid: true };
}

export function validateRequired(value, fieldName = 'Field') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, message: `${fieldName} wajib diisi` };
  }
  return { valid: true };
}

export function validateFileSize(file, maxSizeMB = 5) {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, message: `Ukuran file melebihi ${maxSizeMB}MB` };
  }
  return { valid: true };
}

export function validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP' };
  }
  return { valid: true };
}

export function validatePhotos(files, maxFiles = 3, maxSizeMB = 5) {
  if (!files || files.length === 0) {
    return { valid: true };
  }
  
  if (files.length > maxFiles) {
    return { valid: false, message: `Maksimal ${maxFiles} foto per item` };
  }
  
  for (const file of files) {
    const sizeCheck = validateFileSize(file, maxSizeMB);
    if (!sizeCheck.valid) return sizeCheck;
    
    const typeCheck = validateFileType(file);
    if (!typeCheck.valid) return typeCheck;
  }
  
  return { valid: true };
}