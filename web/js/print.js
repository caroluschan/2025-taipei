/**
 * Print Functionality
 * Handles print button and prepares page for printing
 */

(function() {
    'use strict';

    // Print preparation function
    function preparePrint() {
        // Expand all collapsed sections
        const detailsButtons = document.querySelectorAll('.toggle-details');
        detailsButtons.forEach(button => {
            const content = button.nextElementSibling;
            if (content && content.classList.contains('details-content')) {
                content.style.display = 'block';
                content.style.maxHeight = 'none';
                button.setAttribute('aria-expanded', 'true');
            }
        });

        // Expand all FAQ answers
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            const answer = question.nextElementSibling;
            if (answer && answer.classList.contains('faq-answer')) {
                answer.style.display = 'block';
                answer.style.maxHeight = 'none';
                question.classList.add('active');
            }
        });

        // Add print date
        addPrintDate();
        
        // Add emergency contact summary
        addEmergencyPrintSection();
        
        // Add budget summary for print
        addBudgetPrintSummary();
    }

    // Add print date to the page
    function addPrintDate() {
        const hero = document.querySelector('.hero-content');
        if (hero && !document.querySelector('.print-date-info')) {
            const printDate = document.createElement('div');
            printDate.className = 'print-date-info print-only';
            printDate.style.display = 'none';
            printDate.innerHTML = `<p>列印日期: ${new Date().toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</p>`;
            hero.appendChild(printDate);
        }
    }

    // Add emergency contact summary for print
    function addEmergencyPrintSection() {
        const emergencySection = document.getElementById('emergency-contacts');
        if (emergencySection && !document.querySelector('.emergency-print')) {
            const emergencyPrint = document.createElement('div');
            emergencyPrint.className = 'emergency-print print-only';
            emergencyPrint.style.display = 'none';
            emergencyPrint.innerHTML = `
                <h3>🚨 緊急聯絡資訊</h3>
                <div class="contact-item">
                    <strong>警察局：</strong>
                    <span class="phone">110</span>
                </div>
                <div class="contact-item">
                    <strong>消防局：</strong>
                    <span class="phone">119</span>
                </div>
                <div class="contact-item">
                    <strong>外國人在台生活諮詢熱線：</strong>
                    <span class="phone">1990</span>
                </div>
                <div class="contact-item">
                    <strong>觀光局旅遊諮詢熱線：</strong>
                    <span class="phone">0800-011-765</span>
                </div>
                <div class="contact-item">
                    <strong>香港駐台北經濟貿易文化辦事處：</strong>
                    <span class="phone">(02) 2525-8316</span>
                </div>
            `;
            emergencySection.insertBefore(emergencyPrint, emergencySection.firstChild);
        }
    }

    // Add budget summary table for print
    function addBudgetPrintSummary() {
        const budgetSection = document.getElementById('budget');
        if (budgetSection && !document.querySelector('.budget-summary-print')) {
            const budgetPrint = document.createElement('div');
            budgetPrint.className = 'budget-summary-print print-only';
            budgetPrint.style.display = 'none';
            budgetPrint.innerHTML = `
                <h3>💰 預算總覽</h3>
                <div class="row header">
                    <div class="cell">項目</div>
                    <div class="cell">預算範圍</div>
                    <div class="cell">每人費用</div>
                </div>
                <div class="row">
                    <div class="cell">住宿（3晚）</div>
                    <div class="cell">HK$800 - HK$1,500</div>
                    <div class="cell">視房型而定</div>
                </div>
                <div class="row">
                    <div class="cell">餐飲（4天）</div>
                    <div class="cell">HK$1,000 - HK$1,500</div>
                    <div class="cell">每人每日約HK$250-375</div>
                </div>
                <div class="row">
                    <div class="cell">交通</div>
                    <div class="cell">HK$300 - HK$500</div>
                    <div class="cell">悠遊卡 + 包車</div>
                </div>
                <div class="row">
                    <div class="cell">景點門票</div>
                    <div class="cell">HK$200 - HK$400</div>
                    <div class="cell">台北101、博物館等</div>
                </div>
                <div class="row">
                    <div class="cell">購物預算</div>
                    <div class="cell">HK$500 - HK$1,000</div>
                    <div class="cell">依個人喜好</div>
                </div>
                <div class="row budget-total">
                    <div class="cell"><strong>總計（每人）</strong></div>
                    <div class="cell"><strong>HK$2,800 - HK$4,900</strong></div>
                    <div class="cell"><strong>不含機票</strong></div>
                </div>
            `;
            
            const calculator = budgetSection.querySelector('#budget-calculator');
            if (calculator) {
                budgetSection.insertBefore(budgetPrint, calculator);
            } else {
                budgetSection.appendChild(budgetPrint);
            }
        }
    }

    // Restore page after print
    function restorePage() {
        // Optionally collapse sections again after print
        // For now, we'll leave them expanded for user convenience
    }

    // Handle print button click
    function handlePrint() {
        preparePrint();
        
        // Small delay to ensure DOM updates are rendered
        setTimeout(() => {
            window.print();
            restorePage();
        }, 100);
    }

    // Initialize print button
    function initPrintButton() {
        const printButton = document.getElementById('print-button');
        if (printButton) {
            printButton.addEventListener('click', handlePrint);
        }
    }

    // Handle browser print event (Ctrl+P or Cmd+P)
    window.addEventListener('beforeprint', preparePrint);
    window.addEventListener('afterprint', restorePage);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPrintButton);
    } else {
        initPrintButton();
    }

})();
