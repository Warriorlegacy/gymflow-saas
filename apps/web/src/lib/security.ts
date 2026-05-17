// Input validation and sanitization utilities

// Sanitize string input to prevent XSS
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

// Validate phone number format
export function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, "");
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (!password || password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  if (password.length > 128) {
    return {
      valid: false,
      message: "Password must be less than 128 characters",
    };
  }
  return { valid: true };
}

// Validate UUID format
export function validateUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Validate and sanitize member data
export function validateMemberData(data: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
  sanitized: Record<string, unknown>;
} {
  const errors: string[] = [];
  const sanitized: Record<string, unknown> = {};

  if (data.full_name) {
    sanitized.full_name = sanitizeString(String(data.full_name));
    if (!sanitized.full_name) {
      errors.push("Full name is required");
    }
  }

  if (data.phone) {
    sanitized.phone = String(data.phone).replace(/\D/g, "");
    if (!validatePhone(sanitized.phone as string)) {
      errors.push("Invalid phone number format");
    }
  }

  if (data.email) {
    sanitized.email = sanitizeString(String(data.email).toLowerCase());
    if (sanitized.email && !validateEmail(sanitized.email as string)) {
      errors.push("Invalid email format");
    }
  }

  if (data.status) {
    const validStatuses = ["active", "inactive", "expired", "lead"];
    if (validStatuses.includes(String(data.status))) {
      sanitized.status = data.status;
    } else {
      errors.push("Invalid status value");
    }
  }

  if (data.primary_goal) {
    sanitized.primary_goal = sanitizeString(String(data.primary_goal));
  }

  if (data.notes) {
    sanitized.notes = sanitizeString(String(data.notes));
  }

  if (data.trainer_id) {
    if (validateUUID(String(data.trainer_id))) {
      sanitized.trainer_id = data.trainer_id;
    } else {
      errors.push("Invalid trainer ID format");
    }
  }

  return { valid: errors.length === 0, errors, sanitized };
}

// Validate and sanitize payment data
export function validatePaymentData(data: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
  sanitized: Record<string, unknown>;
} {
  const errors: string[] = [];
  const sanitized: Record<string, unknown> = {};

  if (data.member_id) {
    if (validateUUID(String(data.member_id))) {
      sanitized.member_id = data.member_id;
    } else {
      errors.push("Invalid member ID format");
    }
  }

  if (data.amount !== undefined) {
    const amount = Number(data.amount);
    if (isNaN(amount) || amount < 0) {
      errors.push("Invalid amount");
    } else {
      sanitized.amount = amount;
    }
  }

  if (data.method) {
    const validMethods = ["cash", "upi", "card", "bank", "demo"];
    if (validMethods.includes(String(data.method))) {
      sanitized.method = data.method;
    } else {
      errors.push("Invalid payment method");
    }
  }

  if (data.paid_on) {
    const date = new Date(String(data.paid_on));
    if (!isNaN(date.getTime())) {
      sanitized.paid_on = data.paid_on;
    } else {
      errors.push("Invalid date format");
    }
  }

  return { valid: errors.length === 0, errors, sanitized };
}

// Rate limiting helper with bounded map size
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_RATE_LIMIT_ENTRIES = 10000;

export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000,
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Clean up old entries if map is too large
    if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
      const keysToDelete: string[] = [];
      for (const [k, v] of rateLimitMap.entries()) {
        if (now > v.resetTime) {
          keysToDelete.push(k);
          if (keysToDelete.length >= MAX_RATE_LIMIT_ENTRIES / 2) break;
        }
      }
      for (const k of keysToDelete) {
        rateLimitMap.delete(k);
      }
    }

    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up old rate limit entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 60000);
}
