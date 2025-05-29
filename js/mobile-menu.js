document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle with translations support
    const menuButton = document.querySelector('.ri-menu-line').parentElement;

    menuButton.addEventListener('click', function() {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'fixed inset-0 bg-black/50 z-50 flex justify-end';
        mobileMenu.innerHTML = `
            <div class="bg-white w-3/4 h-full overflow-y-auto">
                <div class="p-4 flex justify-between items-center border-b">
                    <span class="text-xl font-medium" data-translate="global.nav_menu">Menu</span>
                    <button class="w-10 h-10 flex items-center justify-center text-gray-700">
                        <i class="ri-close-line text-2xl"></i>
                    </button>
                </div>
                <nav class="p-4">
                    <a href="index.html" class="block py-3 border-b border-gray-100 text-gray-800" data-translate="global.nav_home">Home</a>
                    <div class="py-3 border-b border-gray-100">
                        <div class="flex justify-between items-center text-gray-800">
                            <span data-translate="global.nav_products">Products</span>
                            <div class="w-8 h-8 flex items-center justify-center">
                                <i class="ri-arrow-down-s-line"></i>
                            </div>
                        </div>
                        <div class="mt-2 pl-4 hidden">
                            <a href="trays.html" class="block py-2 text-gray-700" data-translate="global.nav_trays">Trays</a>
                            <a href="bowls.html" class="block py-2 text-gray-700" data-translate="global.nav_bowls">Bowls</a>
                            <a href="plates.html" class="block py-2 text-gray-700" data-translate="global.nav_plates">Plates</a>
                            <a href="clamshell.html" class="block py-2 text-gray-700" data-translate="global.nav_clamshell">Clamshell Containers</a>
                            <a href="sushi.html" class="block py-2 text-gray-700" data-translate="global.nav_sushi">Sushi Containers</a>
                            <a href="bakery.html" class="block py-2 text-gray-700" data-translate="global.nav_bakery">Bakery Containers</a>
                            <a href="cup&egg.html" class="block py-2 text-gray-700" data-translate="global.nav_cupnegg">Cup Trays / Egg Cartons</a>
                        </div>
                    </div>
                    <div class="py-3 border-b border-gray-100">
                        <div class="flex justify-between items-center text-gray-700">
                            <span data-translate="global.nav_about">About Us</span>
                            <div class="w-8 h-8 flex items-center justify-center">
                                <i class="ri-arrow-down-s-line"></i>
                            </div>
                        </div>
                        <div class="mt-2 pl-4">
                            <a href="company-profile.html" class="block py-2 text-gray-700" data-translate="global.nav_profile">Company Profile</a>
                            <a href="plantation.html" class="block py-2 text-gray-700" data-translate="global.nav_plantation">Bamboo Plantation</a>
                            <a href="processing-plant.html" class="block py-2 text-gray-700" data-translate="global.nav_pplant">Bamboo Fiber Plant</a>
                            <a href="tableware-facility.html" class="block py-2 text-gray-700" data-translate="global.nav_tfactory">Eco Tableware Factory</a>
                        </div>
                    </div>
                    <a href="sustainability.html" class="block py-3 border-b border-gray-100 text-gray-800" data-translate="global.nav_sustainability">Sustainability</a>
                    <a href="contact.html" class="block py-3 border-b border-gray-100 text-gray-800" data-translate="global.nav_contact">Contact</a>
                </nav>
            </div>
        `;

        document.body.appendChild(mobileMenu);
        document.body.style.overflow = 'hidden';

        // Apply translations to new elements
        window.applyTranslations();

        // Close mobile menu
        const closeButton = mobileMenu.querySelector('.ri-close-line').parentElement;
        closeButton.addEventListener('click', function() {
            document.body.removeChild(mobileMenu);
            document.body.style.overflow = '';
        });

        // Dropdown toggles
        const dropdownToggles = mobileMenu.querySelectorAll('.ri-arrow-down-s-line');
        dropdownToggles.forEach(toggle => {
            toggle.parentElement.addEventListener('click', function() {
                const dropdown = this.parentElement.nextElementSibling;
                dropdown.classList.toggle('hidden');
            });
        });
    });
});
