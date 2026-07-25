/**
 * Simple translation logic for the portfolio website.
 */

const translations = {};

/**
 * Load a translation file.
 * @param {string} lang Language code (en, tr, de).
 * @returns {Promise<Object>} The translation data.
 */
async function loadLanguage(lang) {
    if (translations[lang]) return translations[lang];

    try {
        const response = await fetch(`./locales/${lang}.json`);
        if (!response.ok) throw new Error(`Could not load ${lang} translation.`);
        const data = await response.json();
        translations[lang] = data;
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Apply translations to the page.
 * @param {string} lang Language code.
 */
async function applyLanguage(lang) {
    const data = await loadLanguage(lang);
    if (!data) return;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = key.split('.').reduce((obj, i) => (obj ? obj[i] : null), data);

        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                // If element has nested elements (like icons), we might want to be careful.
                // But usually we target the specific text node or an element without children for translation.
                // For nav items, they have a span.nav-icon.
                // Let's check if there's a nav-icon and preserve it if so.
                const icon = element.querySelector('.nav-icon');
                if (icon) {
                    const iconHtml = icon.outerHTML;
                    element.innerHTML = iconHtml + ' ' + translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        }
    });

    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('preferredLanguage', lang);
}

// Expose to window for index.html script access
window.applyLanguage = applyLanguage;

// Event listener for language selection
document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('language-select');
    const savedLang = localStorage.getItem('preferredLanguage') || navigator.language.split('-')[0] || 'en';

    // Ensure we support the detected/saved language
    const supportedLangs = ['en', 'tr', 'de'];
    const finalLang = supportedLangs.includes(savedLang) ? savedLang : 'en';

    if (select) {
        select.value = finalLang;
        select.addEventListener('change', (e) => {
            applyLanguage(e.target.value);
        });
    }

    applyLanguage(finalLang);
});
