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
