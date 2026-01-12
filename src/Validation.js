// Name: only letters & space
export const isValidName = (name) =>
  /^[A-Za-z ]+$/.test(name);

// Email validation
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Phone: only digits, 10 digits
export const isValidPhone = (phone) =>
  /^[0-9]{10}$/.test(phone);

// Number check
export const isValidNumber = (num) =>
  !isNaN(num) && Number(num) > 0;

// Text (no special chars)
export const isValidText = (text) =>
  /^[A-Za-z0-9 ,.]+$/.test(text);
