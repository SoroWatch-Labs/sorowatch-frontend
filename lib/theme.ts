export const THEME_STORAGE_KEY = "sorowatch-theme";

/**
 * Runs in <head> before the page paints, so a saved (or system) dark theme
 * is applied immediately and the page never flashes light first.
 * Wrapped in try/catch because localStorage can throw (private windows,
 * blocked site data).
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})();`;