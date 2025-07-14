export function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateShortcode(code) {
  return /^[a-zA-Z0-9]{4,12}$/.test(code);
}

export function validateValidity(val) {
  return /^\d+$/.test(val) && parseInt(val) > 0;
}

export function generateShortcode() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getExpiryDate(now, validity) {
  const expires = new Date(now.getTime() + validity * 60000);
  return expires.toISOString();
}
