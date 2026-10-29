export interface CachedAccount {
  status: string;
  role: string;
  email: string;
  tokenVersion?: number;
  expiresAt: number;
}

export const accountCache = new Map<string, CachedAccount>();

/**
 * Immediately evicts a user's cached account entry (or the entire cache)
 * when their session, password, role, or status changes.
 */
export function evictAccountCache(userId?: string): void {
  if (userId) {
    accountCache.delete(userId);
  } else {
    accountCache.clear();
  }
}

