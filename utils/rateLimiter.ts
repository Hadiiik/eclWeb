// utils/rateLimiter.ts
interface RateLimitEntry {
    count: number;
    expiresAt: number;
}

const rateLimitCache: Record<string, RateLimitEntry> = {};

const RATE_LIMIT_WINDOW = 20 * 1000; // النافذة الزمنية بالميلي ثانية (هنا دقيقة واحدة)
const MAX_REQUESTS = 10; // الحد الأقصى لعدد الطلبات لكل نافذة زمنية

export function rateLimiter(ip: string): { allowed: boolean, ttl: number } {
    const now = Date.now();
    const entry = rateLimitCache[ip];

    if (entry) {
        if (entry.expiresAt > now) {
            if (entry.count >= MAX_REQUESTS) {
                return { allowed: false, ttl: (entry.expiresAt - now) / 1000 };
            } else {
                entry.count += 1;
            }
        } else {
            entry.count = 1;
            entry.expiresAt = now + RATE_LIMIT_WINDOW;
        }
    } else {
        rateLimitCache[ip] = { count: 1, expiresAt: now + RATE_LIMIT_WINDOW };
    }

    return { allowed: true, ttl: 0 };
}