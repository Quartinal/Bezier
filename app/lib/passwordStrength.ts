export function calculatePasswordStrength(password: string): number {
  let score = 0;

  // Length
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Lowercase letters
  if (/[a-z]/.test(password)) score += 10;

  // Uppercase letters
  if (/[A-Z]/.test(password)) score += 10;

  // Numbers
  if (/\d/.test(password)) score += 10;

  // Special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;

  // Variety of characters
  const uniqueChars = new Set(password).size;
  score += Math.min(20, uniqueChars * 2);

  // Patterns and repetitions
  if (/(.)\\1{2,}/.test(password)) score -= 10;
  if (/^[a-zA-Z]+$/.test(password)) score -= 10;
  if (/^[0-9]+$/.test(password)) score -= 10;

  // Common patterns
  const commonPatterns = [
    "password",
    "123456",
    "qwerty",
    "admin",
    "letmein",
    "welcome",
  ];

  if (
    commonPatterns.some(pattern => password.toLowerCase().includes(pattern))
  ) {
    score -= 20;
  }

  // Normalize score between 0 and 100
  return Math.max(0, Math.min(100, score));
}
