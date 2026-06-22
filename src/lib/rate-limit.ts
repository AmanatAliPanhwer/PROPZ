const rateMap = new Map<string, number[]>();

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const entries = (rateMap.get(key) || []).filter((t) => t > windowStart);
  if (entries.length >= maxRequests) return false;
  entries.push(now);
  rateMap.set(key, entries);
  return true;
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
