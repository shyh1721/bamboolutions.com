// translations.js
document.addEventListener('DOMContentLoaded', function() {
    let currentLang = localStorage.getItem('preferredLang') || 'en';
    let translations = {};

    // Load translations
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            return await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            return {};
        }
    }

    // Save language preference
    function saveLanguagePreference(lang) {
        localStorage.setItem('preferredLang', lang);
    }

    // Update page content
    function applyTranslations() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const keys = element.dataset.translate.split('.');
            let translation = translations[currentLang];

            for (const key of keys) {
                translation = translation?.[key];
                if (!translation) break;
            }

            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    // Language selector click handler
    document.querySelectorAll('.language-option').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            currentLang = button.dataset.lang;
            saveLanguagePreference(currentLang);
            translations[currentLang] = await loadTranslations(currentLang);
            applyTranslations();
        });
    });

    // Initial load
    async function initialize() {
        translations[currentLang] = await loadTranslations(currentLang);
        applyTranslations();
    }

    initialize();
});
