/**
 * This is a compiled JS file.
 * Changes here could be overwritten. 
 * Contact your Shopify developers if changes need to be made.
 */


/* -- index --- */

document.addEventListener('DOMContentLoaded', () => {

    // wishlist
    const WISHLIST_KEY = 'wishlist_items';
    const getWishlist = () => JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    const saveWishlist = (w) => localStorage.setItem(WISHLIST_KEY, JSON.stringify(w));

    const updateWishlistIcons = () => {
        const list = getWishlist();
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.classList.toggle('added', list.includes(btn.dataset.productId));
        });
    };

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.wishlist-btn');
        if (!btn) return;

        let list = getWishlist();
        const id = btn.dataset.productId;

        list = list.includes(id) ? list.filter(x => x !== id) : [...list, id];

        saveWishlist(list);
        updateWishlistIcons();
    });

    updateWishlistIcons();


    //    product card

    document.querySelectorAll('.card_item').forEach((card) => {
        const variantTabs = card.querySelectorAll('.variant_box .variant_box_all_data');
        const priceWrapper = card.querySelector('.price');
        const compareSpan = priceWrapper.querySelector('span');
        const firstImg = card.querySelector('#first_img');
        const addToCartBtn = card.querySelector('.add_to_cart');

        let selectedVariantId = null;


        // variants
        if (variantTabs.length) {
            const t = variantTabs[0];
            t.classList.add("active");
            selectedVariantId = t.dataset.variantId;

            firstImg.src = t.dataset.image;
            priceWrapper.childNodes[0].textContent = `₹${Number(t.dataset.price).toLocaleString()} `;

            if (Number(t.dataset.compareAtPrice) > Number(t.dataset.price)) {
                compareSpan.textContent = `₹${Number(t.dataset.compareAtPrice).toLocaleString()}`;
                compareSpan.style.display = "inline-block";
            } else {
                compareSpan.style.display = "none";
            }

            if (Number(t.dataset.inventory) <= 0) {
                addToCartBtn.textContent = "Out of Stock";
                addToCartBtn.classList.add("disabled");
                addToCartBtn.style.pointerEvents = "none";
                addToCartBtn.style.opacity = "0.5";
            }
        }


        // variant tabs changes
        variantTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                variantTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");

                selectedVariantId = tab.dataset.variantId;

                firstImg.src = tab.dataset.image;
                priceWrapper.childNodes[0].textContent = `₹${Number(tab.dataset.price).toLocaleString()} `;

                if (Number(tab.dataset.compareAtPrice) > Number(tab.dataset.price)) {
                    compareSpan.textContent = `₹${Number(tab.dataset.compareAtPrice).toLocaleString()}`;
                    compareSpan.style.display = "inline-block";
                } else {
                    compareSpan.style.display = "none";
                }

                if (Number(tab.dataset.inventory) <= 0) {
                    addToCartBtn.textContent = "Out of Stock";
                    addToCartBtn.classList.add("disabled");
                    addToCartBtn.style.pointerEvents = "none";
                    addToCartBtn.style.opacity = "0.5";
                } else {
                    addToCartBtn.textContent = "Add To Cart";
                    addToCartBtn.classList.remove("disabled");
                    addToCartBtn.style.pointerEvents = "auto";
                    addToCartBtn.style.opacity = "1";
                }
            });
        });


        //    add to cart funtion 
        addToCartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (!selectedVariantId || addToCartBtn.classList.contains("disabled")) return;

            addToCartBtn.classList.add("loading", "disabled");
            addToCartBtn.style.pointerEvents = "none";

            fetch('/cart/add.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ id: selectedVariantId, quantity: 1 })
            })
                .then(res => res.json())
                .then(data => {
                    addToCartBtn.classList.remove("loading");
                    addToCartBtn.textContent = "ADDED!";

                    setTimeout(() => {
                        addToCartBtn.textContent = "Add To Cart";
                        addToCartBtn.classList.remove("disabled");
                        addToCartBtn.style.pointerEvents = "auto";
                    }, 1500);

                    updateCartDrawer(data);
                });
        });


        function updateCartDrawer(lineItem) {
            fetch('/cart.js')
                .then(res => res.json())
                .then(cart => {

                    /* ---- cart drawer update ---- */
                    document.dispatchEvent(
                        new CustomEvent("theme:cart:update", {
                            detail: { cart, lineItem }
                        })
                    );

                    document.dispatchEvent(
                        new CustomEvent("cart:update", {
                            detail: { data: { cart, sections: cart.sections || {} } }
                        })
                    );

                    /* ---- Re-render cart drawer ---- */
                    if (window.sectionRenderer) {
                        window.sectionRenderer.renderSection("cart-drawer");
                    }

                    /* ---- Open drawer ---- */
                    const drawer = document.querySelector("cart-drawer-component");
                    drawer?.open?.();
                });
        }

    });

});