export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
};

/** Articles du blog. Vide pour l'instant : à brancher sur le contenu (fichiers ou CMS) plus tard. */
export function getPosts(): BlogPost[] {
  return [];
}
