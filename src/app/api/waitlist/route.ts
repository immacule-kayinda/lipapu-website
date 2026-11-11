import { NextResponse } from 'next/server';
import { validateWaitlist } from '@/lib/waitlist';

export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 2_000;
const UPSTREAM_TIMEOUT_MS = 8_000;

type ErrorCode = 'invalid' | 'unavailable' | 'upstream' | 'badRequest' | 'forbidden';

function fail(error: ErrorCode, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, error, ...extra }, { status });
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // appel non navigateur : la validation et le honeypot suffisent
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Reçoit le formulaire de liste d'attente et le transmet à l'API du backend (WAITLIST_API_URL).
 * Rien n'est stocké ni journalisé ici.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail('forbidden', 403);

  const upstreamUrl = process.env.WAITLIST_API_URL;
  if (!upstreamUrl) return fail('unavailable', 503);

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return fail('badRequest', 415);
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return fail('badRequest', 413);
    body = JSON.parse(text);
  } catch {
    return fail('badRequest', 400);
  }
  if (typeof body !== 'object' || body === null) return fail('badRequest', 400);

  const result = validateWaitlist(body as Record<string, unknown>);
  if (!result.ok) return fail('invalid', 422, { errors: result.errors });
  // Robot détecté : on répond comme un succès sans rien transmettre.
  if (result.honeypot) return NextResponse.json({ ok: true });

  const locale =
    typeof (body as { locale?: unknown }).locale === 'string' &&
    /^[a-z]{2}$/.test((body as { locale: string }).locale)
      ? (body as { locale: string }).locale
      : 'fr';

  try {
    const response = await fetch(upstreamUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        contact: result.data.contact,
        type: result.data.type,
        consent: true,
        locale,
        source: 'website',
      }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!response.ok) return fail('upstream', 502);
  } catch {
    return fail('upstream', 502);
  }

  return NextResponse.json({ ok: true });
}
