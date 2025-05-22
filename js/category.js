document.addEventListener('DOMContentLoaded', async function() {
    const currentCategory = window.CURRENT_CATEGORY || 'trays';
    const productContainer = document.getElementById('product-container');

    try {
        const response = await fetch(`categories/${currentCategory}.json`);
        const { products } = await response.json();

        // Clear existing content
        productContainer.innerHTML = '';

        // Create document fragment for batch DOM updates
        const fragment = document.createDocumentFragment();

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden';
            card.innerHTML = `
                <div class="image-container h-64 overflow-hidden">
                    <a href="${product.link}">
                        <img src="${product.image}" 
                             alt="${product.id}"
                             class="w-full h-full object-cover"
                             data-translate="alt|products.${product.id}.title">
                    </a>
                </div>
                <div class="p-5">
                    <h3 class="text-xl font-semibold mb-2 text-center" 
                        data-translate="products.${product.id}.title">
                    </h3>
                    <p class="text-gray-600 mb-4 text-center">
                        ${product.description}
                    </p>
                </div>
            `;
            fragment.appendChild(card);
        });

        productContainer.appendChild(fragment);

        // Trigger translation update after cards are created
        window.updateTranslations?.();

    } catch (error) {
        console.error('Error loading categories:', error);
        productContainer.innerHTML = `
            <div class="text-center py-8 text-red-500" data-translate="errors.load_products">
                Failed to load products. Please try again later.
            </div>
        `;
        window.updateTranslations?.();
    }
});
