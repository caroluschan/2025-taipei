/**
 * PWA Install Prompt
 * Handles "Add to Home Screen" functionality
 */

(function() {
    'use strict';

    let deferredPrompt;
    let installPromptShown = false;

    // Check if already installed
    function isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone || 
               document.referrer.includes('android-app://');
    }

    // Check if prompt has been dismissed
    function isPromptDismissed() {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) return false;
        
        const dismissedDate = new Date(dismissed);
        const now = new Date();
        const daysSinceDismissal = (now - dismissedDate) / (1000 * 60 * 60 * 24);
        
        // Show again after 7 days
        return daysSinceDismissal < 7;
    }

    // Create install prompt UI
    function createInstallPrompt() {
        const promptHTML = `
            <div id="pwa-install-prompt" class="pwa-install-prompt" role="dialog" aria-labelledby="pwa-prompt-title" aria-describedby="pwa-prompt-desc">
                <div class="pwa-prompt-content">
                    <button class="pwa-prompt-close" aria-label="關閉" id="pwa-prompt-close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div class="pwa-prompt-icon">
                        <img src="/images/icons/icon-192.svg" alt="台北聖誕之旅" width="64" height="64">
                    </div>
                    <div class="pwa-prompt-text">
                        <h3 id="pwa-prompt-title">安裝旅遊指南 APP</h3>
                        <p id="pwa-prompt-desc">將本旅遊指南安裝到主畫面，隨時查看行程資訊，支援離線瀏覽！</p>
                    </div>
                    <div class="pwa-prompt-actions">
                        <button id="pwa-install-btn" class="btn-install">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            立即安裝
                        </button>
                        <button id="pwa-later-btn" class="btn-later">稍後</button>
                    </div>
                    <div class="pwa-prompt-features">
                        <div class="feature-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                            <span>離線瀏覽</span>
                        </div>
                        <div class="feature-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                            <span>快速載入</span>
                        </div>
                        <div class="feature-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                <line x1="12" y1="18" x2="12.01" y2="18"></line>
                            </svg>
                            <span>APP 體驗</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', promptHTML);
        
        // Add event listeners
        const installBtn = document.getElementById('pwa-install-btn');
        const laterBtn = document.getElementById('pwa-later-btn');
        const closeBtn = document.getElementById('pwa-prompt-close');
        const prompt = document.getElementById('pwa-install-prompt');

        if (installBtn) {
            installBtn.addEventListener('click', handleInstall);
        }

        if (laterBtn) {
            laterBtn.addEventListener('click', () => dismissPrompt(false));
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => dismissPrompt(true));
        }

        // Show prompt with animation
        setTimeout(() => {
            prompt.classList.add('show');
        }, 500);
    }

    // Handle install button click
    async function handleInstall() {
        if (!deferredPrompt) {
            console.log('No install prompt available');
            return;
        }

        const prompt = document.getElementById('pwa-install-prompt');
        
        // Show native install prompt
        deferredPrompt.prompt();

        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`User response: ${outcome}`);

        if (outcome === 'accepted') {
            console.log('PWA installed successfully');
            localStorage.setItem('pwa-installed', 'true');
        } else {
            console.log('PWA installation dismissed');
        }

        // Remove prompt
        if (prompt) {
            prompt.remove();
        }

        // Clear deferred prompt
        deferredPrompt = null;
        installPromptShown = true;
    }

    // Dismiss prompt
    function dismissPrompt(permanent = false) {
        const prompt = document.getElementById('pwa-install-prompt');
        
        if (prompt) {
            prompt.classList.remove('show');
            setTimeout(() => {
                prompt.remove();
            }, 300);
        }

        if (permanent) {
            localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
        }

        installPromptShown = true;
    }

    // Show install prompt if conditions are met
    function showInstallPrompt() {
        // Don't show if already standalone
        if (isStandalone()) {
            console.log('Already running as PWA');
            return;
        }

        // Don't show if recently dismissed
        if (isPromptDismissed()) {
            console.log('Install prompt recently dismissed');
            return;
        }

        // Don't show if already installed
        if (localStorage.getItem('pwa-installed') === 'true') {
            console.log('PWA already installed');
            return;
        }

        // Don't show if prompt already shown
        if (installPromptShown) {
            return;
        }

        createInstallPrompt();
    }

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt fired');
        
        // Prevent default mini-infobar
        e.preventDefault();
        
        // Store event for later use
        deferredPrompt = e;

        // Show custom prompt after user has interacted with page
        // Wait 5 seconds to ensure user is engaged
        setTimeout(() => {
            if (deferredPrompt && !installPromptShown) {
                showInstallPrompt();
            }
        }, 5000);
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
        console.log('PWA installed');
        localStorage.setItem('pwa-installed', 'true');
        deferredPrompt = null;
        
        // Remove prompt if still visible
        const prompt = document.getElementById('pwa-install-prompt');
        if (prompt) {
            prompt.remove();
        }
    });

    // Check service worker support
    if ('serviceWorker' in navigator) {
        // Update service worker when available
        navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) {
                reg.update();
            }
        });

        // Listen for service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker updated');
            
            // Optionally show update notification
            if (isStandalone()) {
                showUpdateNotification();
            }
        });
    }

    // Show update notification
    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <p>✨ 新版本可用！</p>
                <button id="reload-btn" class="btn-reload">重新載入</button>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        const reloadBtn = document.getElementById('reload-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    // Manual trigger function for testing
    window.showPWAInstallPrompt = function() {
        if (deferredPrompt) {
            showInstallPrompt();
        } else {
            console.log('Install prompt not available. This only works on supported browsers and protocols (HTTPS).');
        }
    };

    console.log('[PWA Install] Module loaded');
})();
