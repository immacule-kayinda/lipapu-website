import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Tout sauf l'API, les images Open Graph, fichiers internes de Next.js et les fichiers statiques (avec extension).
  matcher: ['/((?!api|_next|_vercel|opengraph-image|.*\\..*).*)'],
};
