// ================= CONTACT LINK HELPERS =================

/**
 * Clean phone number to international format for WhatsApp
 */
function cleanPhoneForWhatsApp(phone?: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, '');
  if (digits.length < 10) return null;
  // If starts with 91, keep. Else prepend 91 (India default)
  return digits.startsWith('91') ? digits : `91${digits}`;
}

/**
 * WhatsApp chat link with optional pre-filled message
 */
export function whatsappLink(phone?: string, message?: string): string | null {
  const cleaned = cleanPhoneForWhatsApp(phone);
  if (!cleaned) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleaned}${text}`;
}

/**
 * Tel link for phone calls
 */
export function telLink(phone?: string): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.length >= 10 ? `tel:${cleaned}` : null;
}

/**
 * Mailto link with subject
 */
export function mailtoLink(email?: string, subject?: string): string | null {
  if (!email || !email.includes('@')) return null;
  const sub = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${email}${sub}`;
}

/**
 * Instagram link
 */
export function instagramLink(handle?: string): string | null {
  if (!handle) return null;
  const clean = handle.replace(/[@\s]/g, '').replace('https://instagram.com/', '').replace('instagram.com/', '');
  if (!clean) return null;
  return `https://instagram.com/${clean}`;
}

/**
 * Check if phone is valid for WhatsApp
 */
export function isValidPhone(phone?: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length >= 10;
}

/**
 * Check if email is valid
 */
export function isValidEmail(email?: string): boolean {
  return !!email && email.includes('@') && email.includes('.');
}
