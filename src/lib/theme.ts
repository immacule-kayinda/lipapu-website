export const THEME_STORAGE_KEY = 'joga-theme';

export type ThemeChoice = 'system' | 'light' | 'dark';

/**
 * Script exécuté avant l'affichage pour appliquer le thème choisi (évite un flash).
 * Le choix reste dans le navigateur (localStorage), jamais envoyé ni stocké en cookie.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}`;
