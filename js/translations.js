document.addEventListener('DOMContentLoaded', function() {
    let currentLang = localStorage.getItem('preferredLang') || 'en';
    let currentCategory = window.CURRENT_CATEGORY || 'trays';
    let translations = {};

    // Cache for loaded translations
    const translationCache = new Map();

    async function loadAllTranslations(lang) {
        const cacheKey = `${lang}-${currentCategory}`;

        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey);
        }

        try {
            const [uiTranslations, categoryData] = await Promise.all([
                fetch(`lang/${lang}.json`).then(r => r.json()),
                fetch(`categories/${currentCategory}.json`).then(r => r.json())
            ]);

            const mergedTranslations = {
                ...flattenTranslations(uiTranslations),
                ...flattenTranslations({
                    category: categoryData.meta.translations[lang],
                    products: categoryData.products.reduce((acc, product) => {
                        acc[product.id] = product.translations[lang];
                        return acc;
                    }, {})
                })
            };

            translationCache.set(cacheKey, mergedTranslations);
            return mergedTranslations;

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

    function applyTranslations() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const [attribute, key] = element.dataset.translate.split('|');
            const translation = key ? translations[key] : translations[element.dataset.translate];

            if (translation) {
                if (attribute === 'alt') {
                    element.alt = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });
    }

    async function updateTranslations(lang = currentLang) {
        translations = await loadAllTranslations(lang);
        applyTranslations();
    }

    document.querySelectorAll('.language-option').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            currentLang = button.dataset.lang;
            localStorage.setItem('preferredLang', currentLang);
            await updateTranslations();
        });
    });

    // Initial setup
    updateTranslations();
    window.updateTranslations = updateTranslations;
    window.applyTranslations = applyTranslations;
});
