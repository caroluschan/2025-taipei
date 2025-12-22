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
                        
                        // Refresh map for this day
                        if (typeof window.refreshDayMap === 'function') {
                            window.refreshDayMap(index + 1);
                        }
                        
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

// ===================================
// Emergency Modal Functionality
// ===================================
function initEmergencyModal() {
    const emergencyFab = document.getElementById('emergency-fab');
    const emergencyModal = document.getElementById('emergency-modal');
    const closeModalBtn = document.getElementById('close-emergency-modal');
    const modalOverlay = document.querySelector('.emergency-modal-overlay');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const downloadBtn = document.getElementById('download-contacts');
    const printBtn = document.getElementById('print-contacts');
    
    // Open modal
    function openEmergencyModal() {
        emergencyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Trap focus within modal
        const focusableElements = emergencyModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        firstFocusable.focus();
        
        // Handle Tab key for focus trap
        emergencyModal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }
    
    // Close modal
    function closeEmergencyModal() {
        emergencyModal.classList.remove('active');
        document.body.style.overflow = '';
        emergencyFab.focus();
    }
    
    // Copy to clipboard
    function copyToClipboard(text, button) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccess(button);
            }).catch(err => {
                console.error('Failed to copy:', err);
                fallbackCopy(text, button);
            });
        } else {
            fallbackCopy(text, button);
        }
    }
    
    // Fallback copy method for older browsers
    function fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopySuccess(button);
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    // Show copy success feedback
    function showCopySuccess(button) {
        button.classList.add('copied');
        const originalHTML = button.innerHTML;
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalHTML;
        }, 2000);
    }
    
    // Download contact card as text file
    function downloadContactCard() {
        const contactData = `
🆘 台北旅遊緊急聯絡卡
=========================

📅 旅遊日期：2025年12月25日-28日

🚨 緊急服務
-----------
警察局：110
消防/救護車：119

🏥 醫院
-------
台大醫院：02-2312-3456
國泰綜合醫院：02-2708-2121

🇭🇰 香港辦事處
--------------
香港經濟貿易文化辦事處：02-2525-8316
地址：台北市松山區松高路9-11號26樓

🏨 住宿酒店
-----------
（請在訂房確認後手動填寫）
酒店名稱：_______________
酒店電話：_______________
酒店地址：_______________

📝 重要提醒
-----------
- 請將此卡列印並隨身攜帶
- 建議存一份在手機相簿中離線查看
- 如有緊急情況，請先撥打110或119
- 保持冷靜，清楚說明所在位置

=========================
Generated: ${new Date().toLocaleString('zh-TW')}
        `;
        
        const blob = new Blob([contactData], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '台北旅遊緊急聯絡卡.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Show notification
        showNotification('✅ 聯絡卡已下載！');
    }
    
    // Print contact card
    function printContactCard() {
        window.print();
    }
    
    // Show notification (reuse from checklist)
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
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    // Event listeners
    if (emergencyFab) emergencyFab.addEventListener('click', openEmergencyModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeEmergencyModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeEmergencyModal);
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && emergencyModal.classList.contains('active')) {
            closeEmergencyModal();
        }
    });
    
    // Copy buttons
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            copyToClipboard(textToCopy, this);
        });
    });
    
    // Download and print buttons
    if (downloadBtn) downloadBtn.addEventListener('click', downloadContactCard);
    if (printBtn) printBtn.addEventListener('click', printContactCard);
}

// ===================================
// Update Main Initialization
// ===================================
const originalDOMContentLoaded = document.addEventListener('DOMContentLoaded', function() {
    initImportantInfo();
    initEmergencyModal();
});
