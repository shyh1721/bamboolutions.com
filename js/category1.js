document.addEventListener('DOMContentLoaded', async function() {
    const currentCategory = window.CURRENT_CATEGORY || 'trays';
    const productContainer = document.getElementById('product-container');

    try {
        const response = await fetch(`categories/${currentCategory}.json`);
        const categoryData = await response.json();

        // Clear existing content
        productContainer.innerHTML = '';

        // Generate product cards
        categoryData.products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden';
            card.innerHTML = `
                <div class="image-container h-64 overflow-hidden">
                    <a href="${product.link}"</a>
                    <img src="${product.image}" alt="${product.id}" class="w-full h-full object-cover">
                </div>
                <div class="p-5">
                    <a href="${product.link}"</a>
                    <h3 class="text-xl font-semibold mb-2 text-center" 
                        data-translate="products_page.${product.id}.title">
                        ${product.translations.en.title}
                    </h3>
                    <p class="text-gray-600 mb-4 text-center" >
                        ${product.description}
                    </p>
                    
                    </div>
                </div>
            `;
            productContainer.appendChild(card);
        });

        // Apply translations after cards are created
        if (window.applyTranslations) {
            window.applyTranslations();
        }

    } catch (error) {
        console.error('Error loading categories:', error);
        productContainer.innerHTML = `
            <div class="text-center py-8 text-red-500" data-translate="errors.load_products">
                Failed to load products. Please try again later.
            </div>
        `;
    }
});
