/**
 * Taipei Christmas Travel Guide 2025
 * Main JavaScript File
 * Handles navigation, scroll effects, and UI interactions
 */

(function() {
    'use strict';

    // ===================================
    // DOM Elements
    // ===================================
    const header = document.getElementById('header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // ===================================
    // Mobile Navigation Toggle
    // ===================================
    function initMobileNav() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            const isActive = this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA attribute
            this.setAttribute('aria-expanded', isActive);
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (isActive) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = header ? header.offsetHeight : 0;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // ===================================
    // Active Nav Link on Scroll
    // ===================================
    function initActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length === 0) return;

        function setActiveNav() {
            const scrollY = window.pageYOffset;
            const headerHeight = header ? header.offsetHeight : 0;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                } else if (navLink) {
                    navLink.classList.remove('active');
                }
            });
        }

        window.addEventListener('scroll', setActiveNav);
        setActiveNav(); // Initial call
    }

    // ===================================
    // Header Shadow on Scroll
    // ===================================
    function initHeaderShadow() {
        if (!header) return;

        function updateHeaderShadow() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', updateHeaderShadow);
        updateHeaderShadow(); // Initial call
    }

    // ===================================
    // Scroll to Top Button (Optional)
    // ===================================
    function initScrollToTop() {
        // Check if scroll-to-top button exists
        const scrollTopBtn = document.getElementById('scroll-to-top');
        
        if (!scrollTopBtn) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===================================
    // Lazy Load Images (Future enhancement)
    // ===================================
    function initLazyLoad() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ===================================
    // Animation on Scroll (Future enhancement)
    // ===================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if ('IntersectionObserver' in window && animatedElements.length > 0) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, {
                threshold: 0.1
            });

            animatedElements.forEach(el => animationObserver.observe(el));
        }
    }

    // ===================================
    // Accordion Functionality
    // ===================================
    function initAccordions() {
        const accordionTriggers = document.querySelectorAll('.accordion-trigger');
        
        if (accordionTriggers.length === 0) return;

        accordionTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Close all other accordions (optional - comment out for multi-open behavior)
                accordionTriggers.forEach(otherTrigger => {
                    if (otherTrigger !== this) {
                        otherTrigger.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current accordion
                this.setAttribute('aria-expanded', !isExpanded);
                
                // Smooth scroll to accordion if opening and it's near bottom of viewport
                if (!isExpanded) {
                    setTimeout(() => {
                        const rect = this.getBoundingClientRect();
                        const headerHeight = header ? header.offsetHeight : 0;
                        
                        if (rect.top < headerHeight + 20) {
                            const targetPosition = this.offsetTop - headerHeight - 20;
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }, 100);
                }
            });
        });
    }

    // ===================================
    // Activity Details Toggle
    // ===================================
    function initActivityToggles() {
        const toggleButtons = document.querySelectorAll('.toggle-details');
        
        if (toggleButtons.length === 0) return;

        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Toggle current activity
                this.setAttribute('aria-expanded', !isExpanded);
                
                // Optional: Auto-scroll to keep activity in view when expanding
                if (!isExpanded) {
                    setTimeout(() => {
                        const rect = this.getBoundingClientRect();
                        const headerHeight = header ? header.offsetHeight : 0;
                        
                        if (rect.top < headerHeight) {
                            window.scrollTo({
                                top: window.pageYOffset + rect.top - headerHeight - 20,
                                behavior: 'smooth'
                            });
                        }
                    }, 350); // Wait for expansion animation
                }
            });
        });
    }

    // ===================================
    // Day Navigation
    // ===================================
    function initDayNavigation() {
        const dayNavBtns = document.querySelectorAll('.day-nav-btn');
        const daySections = document.querySelectorAll('.day-section');
        
        if (dayNavBtns.length === 0 || daySections.length === 0) return;

        // Hide all days except first one initially
        daySections.forEach((section, index) => {
            if (index > 0) {
                section.style.display = 'none';
            }
        });

        dayNavBtns.forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active button
                dayNavBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding day section
                daySections.forEach((section, i) => {
                    if (i === index) {
                        section.style.display = 'block';
                        
                        // Smooth scroll to itinerary section
                        const itinerarySection = document.getElementById('itinerary');
                        if (itinerarySection && header) {
                            const targetPosition = itinerarySection.offsetTop - header.offsetHeight;
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    } else {
                        section.style.display = 'none';
                    }
                });
            });
        });

        // Handle hash navigation on page load
        const hash = window.location.hash;
        if (hash && hash.match(/#day\d/)) {
            const dayNum = parseInt(hash.replace('#day', '')) - 1;
            if (dayNum >= 0 && dayNum < dayNavBtns.length) {
                dayNavBtns[dayNum].click();
            }
        }
    }

    // ===================================
    // Utility: Debounce Function
    // ===================================
    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // ===================================
    // Initialize All Functions
    // ===================================
    function init() {
        initMobileNav();
        initSmoothScroll();
        initActiveNavOnScroll();
        initHeaderShadow();
        initScrollToTop();
        initLazyLoad();
        initScrollAnimations();
        initAccordions();
        initActivityToggles();
        initDayNavigation();

        console.log('Taipei Christmas Travel Guide 2025 - Initialized');
    }

    // ===================================
    // DOM Ready
    // ===================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// ===================================
// FAQ Accordion Functionality
// ===================================
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            this.setAttribute('aria-expanded', !isExpanded);
        });
    });
}

// ===================================
// Checklist Functionality with LocalStorage
// ===================================
function initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const saveBtn = document.getElementById('save-checklist');
    const resetBtn = document.getElementById('reset-checklist');
    const printBtn = document.getElementById('print-checklist');
    
    // Load saved state from localStorage
    function loadChecklistState() {
        checkboxes.forEach(checkbox => {
            const savedState = localStorage.getItem(`checklist-${checkbox.id}`);
            if (savedState === 'true') {
                checkbox.checked = true;
            }
        });
    }
    
    // Save state to localStorage
    function saveChecklistState() {
        checkboxes.forEach(checkbox => {
            localStorage.setItem(`checklist-${checkbox.id}`, checkbox.checked);
        });
        
        // Show confirmation
        showNotification('✅ 清單已儲存！');
    }
    
    // Reset all checkboxes
    function resetChecklist() {
        if (confirm('確定要重設所有清單項目嗎？')) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                localStorage.removeItem(`checklist-${checkbox.id}`);
            });
            showNotification('🔄 清單已重設');
        }
    }
    
    // Print checklist
    function printChecklist() {
        // Expand all FAQ items for printing
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(q => q.setAttribute('aria-expanded', 'true'));
        
        // Trigger print
        setTimeout(() => {
            window.print();
            
            // Collapse FAQ items after printing
            setTimeout(() => {
                faqQuestions.forEach(q => q.setAttribute('aria-expanded', 'false'));
            }, 100);
        }, 100);
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'checklist-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary), #a01729);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    // Add CSS animation
    if (!document.getElementById('checklist-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'checklist-notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Event listeners
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveChecklistState);
    });
    
    if (saveBtn) saveBtn.addEventListener('click', saveChecklistState);
    if (resetBtn) resetBtn.addEventListener('click', resetChecklist);
    if (printBtn) printBtn.addEventListener('click', printChecklist);
    
    // Load saved state on page load
    loadChecklistState();
}

// ===================================
// Initialize Important Information Features
// ===================================
function initImportantInfo() {
    initFAQAccordion();
    initChecklist();
}

// Add to main initialization
document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization code ...
    initImportantInfo();
});
