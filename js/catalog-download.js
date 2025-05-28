document.addEventListener('DOMContentLoaded', function() {
    // Get current language from localStorage
    const currentLang = localStorage.getItem('preferredLang') || 'en';

    // Update catalog link on page load
    updateCatalogLink(currentLang);

    // Listen for language changes
    document.querySelector('.language-dropdown').addEventListener('click', (e) => {
        if(e.target.classList.contains('language-option')) {
            const newLang = e.target.dataset.lang;
            updateCatalogLink(newLang);
        }
    });
});

function updateCatalogLink(lang) {
    const catalogLink = document.querySelector('[data-catalog-link]');
    if(catalogLink) {
        catalogLink.href = `assets/catalog-${lang}.pdf`;
    }
}
