export const ADMIN_EMAIL = "rjdhav67@gmail.com";

type SessionLike = {
  user?: {
    email?: string | null;
  } | null;
} | null;

export function isAdmin(session: SessionLike): boolean {
  const email = session?.user?.email?.trim().toLowerCase();
  return email === ADMIN_EMAIL.toLowerCase();
}
