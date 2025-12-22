/**
 * Lightbox & Image Gallery
 * Handles image gallery interactions and lightbox functionality
 */

(function() {
    'use strict';

    let currentGallery = [];
    let currentIndex = 0;
    let currentGalleryName = '';

    // ===================================
    // Initialize Lightbox
    // ===================================
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-title');
        const lightboxCounter = document.querySelector('.lightbox-counter');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        const overlay = document.querySelector('.lightbox-overlay');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (!lightbox) return;

        // Open lightbox
        function openLightbox(galleryName, index) {
            currentGalleryName = galleryName;
            const gallery = document.querySelector(`[data-gallery="${galleryName}"]`);
            if (!gallery) return;

            const items = gallery.querySelectorAll('.gallery-item');
            currentGallery = Array.from(items).map(item => ({
                src: item.dataset.src,
                caption: item.dataset.caption
            }));

            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus close button for accessibility
            closeBtn.focus();
        }

        // Close lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            currentGallery = [];
            currentIndex = 0;
        }

        // Update lightbox image
        function updateLightboxImage() {
            if (currentGallery.length === 0) return;

            const current = currentGallery[currentIndex];
            
            // For placeholder, show the placeholder element
            lightboxImage.src = current.src;
            lightboxImage.alt = current.caption;
            lightboxCaption.textContent = current.caption;
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;

            // Update navigation buttons
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === currentGallery.length - 1;
        }

        // Navigate to previous image
        function showPrevious() {
            if (currentIndex > 0) {
                currentIndex--;
                updateLightboxImage();
            }
        }

        // Navigate to next image
        function showNext() {
            if (currentIndex < currentGallery.length - 1) {
                currentIndex++;
                updateLightboxImage();
            }
        }

        // Event listeners for gallery items
        galleryItems.forEach((item, globalIndex) => {
            item.addEventListener('click', function() {
                const gallery = this.closest('.image-gallery');
                const galleryName = gallery.dataset.gallery;
                const items = gallery.querySelectorAll('.gallery-item');
                const localIndex = Array.from(items).indexOf(this);
                openLightbox(galleryName, localIndex);
            });

            // Keyboard accessibility for gallery items
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `查看 ${item.dataset.caption}`);
            
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Event listeners for lightbox controls
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (overlay) overlay.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', showPrevious);
        if (nextBtn) nextBtn.addEventListener('click', showNext);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevious();
                    break;
                case 'ArrowRight':
                    showNext();
                    break;
            }
        });

        // Prevent image dragging in lightbox
        if (lightboxImage) {
            lightboxImage.addEventListener('dragstart', (e) => e.preventDefault());
        }

        // Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next image
                    showNext();
                } else {
                    // Swipe right - previous image
                    showPrevious();
                }
            }
        }
    }

    // ===================================
    // Lazy Loading for Images
    // ===================================
    function initLazyLoading() {
        const images = document.querySelectorAll('.gallery-item[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const item = entry.target;
                        item.classList.add('lazy-loaded');
                        observer.unobserve(item);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => img.classList.add('lazy-loaded'));
        }
    }

    // ===================================
    // Initialize on DOM ready
    // ===================================
    document.addEventListener('DOMContentLoaded', function() {
        initLightbox();
        initLazyLoading();
    });

})();
