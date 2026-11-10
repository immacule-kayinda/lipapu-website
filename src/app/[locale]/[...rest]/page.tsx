import { notFound } from 'next/navigation';

/** Toute adresse inconnue passe par ici pour afficher la page 404 localisée. */
export default function CatchAll() {
  notFound();
}
