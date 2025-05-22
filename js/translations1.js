// translations.js
document.addEventListener('DOMContentLoaded', function() {
    let currentLang = localStorage.getItem('preferredLang') || 'en';
    let currentCategory = window.CURRENT_CATEGORY || 'trays';
    let translations = {};

    async function loadAllTranslations(lang) {
    try {
        const [uiTranslations, categoryData] = await Promise.all([
            fetch(`lang/${lang}.json`).then(r => r.json()),
            fetch(`categories/${currentCategory}.json`).then(r => r.json())
        ]);

        // Add this line to include products_page translations
        const productsPageTranslations = uiTranslations.products_page || {};

        const productTranslations = categoryData.products.reduce((acc, product) => {
            acc[product.id] = product.translations[lang];
            return acc;
        }, {});

        return {
            ...flattenTranslations(uiTranslations),
            ...flattenTranslations({
                category: categoryData.meta.translations[lang],
                products: productTranslations,
                products_page: productsPageTranslations  // Add this line
            })
        };

    } catch (error) {
        console.error('Error loading translations:', error);
        return {};
    }
}


    function flattenTranslations(data, prefix = '') {
        return Object.keys(data).reduce((acc, key) => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof data[key] === 'object' && data[key] !== null) {
                Object.assign(acc, flattenTranslations(data[key], fullKey));
            } else {
                acc[fullKey] = data[key];
            }
            return acc;
        }, {});
    }

    function saveLanguagePreference(lang) {
        localStorage.setItem('preferredLang', lang);
    }

    function applyTranslations() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            const translation = translations[key];

            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    document.querySelectorAll('.language-option').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            currentLang = button.dataset.lang;
            saveLanguagePreference(currentLang);
            translations = await loadAllTranslations(currentLang);
            applyTranslations();
        });
    });

    async function initialize() {
        translations = await loadAllTranslations(currentLang);
        applyTranslations();
    }

    initialize();
});
