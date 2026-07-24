const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const LIMITS = {
  messageMaxChars: 1000,
  businessNameMaxChars: 120,
  supportEmailMaxChars: 160,
  knowledgeMaxChars: 40_000,
  ownerIdMaxChars: 200,
} as const

export function asTrimmedString(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.length > maxLen) return trimmed.slice(0, maxLen)
  return trimmed
}

export function validateOwnerId(value: unknown): string | null {
  return asTrimmedString(value, LIMITS.ownerIdMaxChars)
}

export function validateChatMessage(value: unknown):
  | { ok: true; message: string }
  | { ok: false; error: string } {
  if (typeof value !== "string") {
    return { ok: false, error: "Message is required" }
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return { ok: false, error: "Message cannot be empty" }
  }
  if (trimmed.length > LIMITS.messageMaxChars) {
    return {
      ok: false,
      error: `Message is too long (max ${LIMITS.messageMaxChars} characters)`,
    }
  }
  return { ok: true, message: trimmed }
}

export function validateEmail(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.length > LIMITS.supportEmailMaxChars) return null
  if (!EMAIL_RE.test(trimmed)) return null
  return trimmed
}

export function validateOptionalEmail(value: unknown):
  | { ok: true; email: string }
  | { ok: false; error: string } {
  if (value == null || value === "") {
    return { ok: true, email: "" }
  }
  if (typeof value !== "string") {
    return { ok: false, error: "Support email must be a string" }
  }
  const trimmed = value.trim()
  if (!trimmed) return { ok: true, email: "" }
  if (trimmed.length > LIMITS.supportEmailMaxChars) {
    return { ok: false, error: "Support email is too long" }
  }
  if (!EMAIL_RE.test(trimmed)) {
    return { ok: false, error: "Enter a valid support email" }
  }
  return { ok: true, email: trimmed }
}
