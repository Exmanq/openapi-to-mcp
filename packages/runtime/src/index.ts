export interface RuntimeOptions {
  authToken?: string;
  rateLimitPerMinute?: number;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export interface RuntimeContext {
  allowed: boolean;
  reason?: string;
  remaining?: number;
}

export class McpRuntimeGuard {
  private readonly requests = new Map<string, { count: number; bucket: number }>();

  constructor(private readonly options: RuntimeOptions) {}

  authorize(token?: string): RuntimeContext {
    if (!this.options.authToken) return { allowed: true };
    if (token !== this.options.authToken) {
      return { allowed: false, reason: 'Invalid auth token' };
    }
    return { allowed: true };
  }

  rateLimit(key: string): RuntimeContext {
    const limit = this.options.rateLimitPerMinute ?? 60;
    const nowBucket = Math.floor(Date.now() / 60000);
    const row = this.requests.get(key);
    if (!row || row.bucket !== nowBucket) {
      this.requests.set(key, { count: 1, bucket: nowBucket });
      return { allowed: true, remaining: limit - 1 };
    }
    if (row.count >= limit) {
      return { allowed: false, reason: 'Rate limit exceeded', remaining: 0 };
    }
    row.count += 1;
    this.requests.set(key, row);
    return { allowed: true, remaining: limit - row.count };
  }

  log(event: string, payload: Record<string, unknown>): void {
    const level = this.options.logLevel ?? 'info';
    const line = JSON.stringify({ level, event, payload, ts: new Date().toISOString() });
    console.log(line);
  }
}
