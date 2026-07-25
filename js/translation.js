/**
 * Network-based translation logic using Google Translate Widget.
 */

/**
 * Trigger Google Translate Widget
 */
function triggerGoogleTranslate(langCode) {
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
        googleSelect.value = langCode;
        googleSelect.dispatchEvent(new Event('change'));
    } else {
        // If widget not ready yet, retry
        setTimeout(() => {
            const retrySelect = document.querySelector('.goog-te-combo');
            if (retrySelect) {
                retrySelect.value = langCode;
                retrySelect.dispatchEvent(new Event('change'));
            }
        }, 1000);
    }
}

/**
 * Apply language selection
 */
function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('preferredLanguage', lang);
    triggerGoogleTranslate(lang);
}

// Expose to window
window.applyLanguage = applyLanguage;

// Event listener for language selection
document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('language-select');

    // 1. Determine target language: Priority to Saved, then Browser, default to 'fr'
    const browserLang = navigator.language.split('-')[0];
    const savedLang = localStorage.getItem('preferredLanguage');

    // We only auto-translate if it's not French
    const finalLang = savedLang || (browserLang !== 'fr' ? browserLang : 'fr');

    if (select) {
        select.value = finalLang;
        select.addEventListener('change', (e) => {
            applyLanguage(e.target.value);
        });
    }

    // 2. Initial trigger if not French
    if (finalLang !== 'fr') {
        setTimeout(() => applyLanguage(finalLang), 1000);
    }
});
