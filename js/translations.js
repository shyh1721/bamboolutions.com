document.addEventListener('DOMContentLoaded', async function() {
    // Path configuration
    const BASE_PATH = window.location.pathname.includes('/products/')
                    ? '../'
                    : './';

    // Get translation context
    const productId = document.body.dataset.productId;
    const currentCategory = window.CURRENT_CATEGORY || document.body.dataset.category;
    const currentLang = localStorage.getItem('preferredLang') || 'en';

    async function loadTranslations() {
        try {
            // Load core translations
            const [langData, categoryData] = await Promise.all([
                fetch(`${BASE_PATH}lang/${currentLang}.json`).then(r => r.json()),
                currentCategory ? fetch(`${BASE_PATH}categories/${currentCategory}.json`).then(r => r.json()) : null
            ]);

            // Load product-specific translations if needed
            let productTranslations = {};
            if(productId) {
                const productData = await fetch(`${BASE_PATH}categories/${currentCategory}.json`).then(r => r.json());
                const product = productData.products.find(p => p.id === productId);
                productTranslations = product?.translations?.[currentLang] || {};
            }

            // Merge translations
            return {
                ...langData,
                ...(categoryData?.meta?.translations?.[currentLang] || {}),
                products: {
                    ...(langData.products || {}),
                    ...(productId ? { [productId]: productTranslations } : {})
                }
            };

        } catch(error) {
            console.error('Translation load error:', error);
            return {};
        }
    }

    // Apply translations to elements
    window.updateTranslations = async function() {
        const translations = await loadTranslations();

        document.querySelectorAll('[data-translate]').forEach(element => {
            const [attr, key] = element.dataset.translate.split('|').reverse();
            const value = key.split('.').reduce((acc, k) => acc?.[k], translations);

            if(value) {
                if(attr === 'alt' && element.tagName === 'IMG') {
                    element.alt = value;
                } else {
                    element.textContent = value;
                }
            }
        });
    };

    // Initialize translations
    await window.updateTranslations();

    // Language selector handlers
    document.querySelectorAll('.language-option').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            localStorage.setItem('preferredLang', button.dataset.lang);
            window.location.reload();
        });
    });
});
