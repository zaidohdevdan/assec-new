import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

interface AttemptRecord {
  failures: number;
  windowStart: number;
  lockedUntil: number;
}

/**
 * Brute-force protection for the login endpoint, applied per account (e-mail)
 * and per client IP. Complements the nginx per-IP rate limit, which cannot
 * protect a single account from a distributed attack and penalises users
 * behind a shared NAT.
 *
 * State is kept in memory: it is lost on restart and is not shared between
 * instances. That is acceptable for the current single backend container.
 * TODO(security): move this state to Redis/Postgres before running more than
 * one backend replica.
 *
 * Trade-off: an attacker who knows a victim's e-mail can lock that account's
 * login for LOCK_MS. The lock is short and the IP key is evaluated separately.
 */
@Injectable()
export class LoginThrottleService {
  private readonly WINDOW_MS = 15 * 60 * 1000;
  private readonly LOCK_MS = 15 * 60 * 1000;
  private readonly MAX_PER_ACCOUNT = 8;
  private readonly MAX_PER_IP = 30;
  private readonly MAX_ENTRIES = 10_000;

  private records = new Map<string, AttemptRecord>();

  private keys(email: string, ip: string) {
    return {
      account: {
        key: `acct:${email.trim().toLowerCase()}`,
        max: this.MAX_PER_ACCOUNT,
      },
      ip: { key: `ip:${ip}`, max: this.MAX_PER_IP },
    };
  }

  /** Throws 429 if the account or the IP is currently locked. */
  assertAllowed(email: string, ip: string, now = Date.now()): void {
    const { account, ip: ipKey } = this.keys(email, ip);
    for (const { key } of [account, ipKey]) {
      const rec = this.records.get(key);
      if (rec && rec.lockedUntil > now) {
        throw new HttpException(
          'Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
  }

  recordFailure(email: string, ip: string, now = Date.now()): void {
    this.prune(now);
    const { account, ip: ipKey } = this.keys(email, ip);
    for (const { key, max } of [account, ipKey]) {
      let rec = this.records.get(key);
      if (!rec || now - rec.windowStart > this.WINDOW_MS) {
        rec = { failures: 0, windowStart: now, lockedUntil: 0 };
      }
      rec.failures += 1;
      if (rec.failures >= max) {
        rec.lockedUntil = now + this.LOCK_MS;
        rec.failures = 0;
        rec.windowStart = now;
      }
      this.records.set(key, rec);
    }
  }

  /** A successful login clears the account counter (the IP counter keeps running). */
  recordSuccess(email: string): void {
    this.records.delete(`acct:${email.trim().toLowerCase()}`);
  }

  private prune(now: number): void {
    if (this.records.size < this.MAX_ENTRIES) return;
    for (const [key, rec] of this.records) {
      if (rec.lockedUntil <= now && now - rec.windowStart > this.WINDOW_MS) {
        this.records.delete(key);
      }
    }
  }
}
