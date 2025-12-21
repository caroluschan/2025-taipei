/**
 * Taipei Christmas Travel Guide 2025
 * Budget Calculator JavaScript
 * Handles budget estimation and cost breakdowns
 */

(function() {
    'use strict';

    // ===================================
    // Budget Data Structure
    // ===================================
    const BUDGET_DATA = {
        // Exchange rate (HKD to TWD)
        exchangeRate: 4.0, // 1 HKD ≈ 4 TWD
        
        // Transportation costs (per person, in TWD)
        transportation: {
            airportTransit: {
                mrt: 160,
                taxi: 450 // 8-person taxi divided by 8
            },
            easyCard: 500,
            daily: 200 // Average daily transport
        },
        
        // Accommodation (total for all 8 people, in TWD)
        accommodation: {
            // To be filled when actual prices are available
            'taipei-view-hotel': 0, // 2 nights
            'beitou-spa-hotel': 0 // 1 night
        },
        
        // Daily budgets by day (per person, in TWD)
        dailyBudgets: {
            day1: {
                transport: 350,
                food: 1100,
                admission: 600,
                shopping: 1200,
                total: 3250
            },
            day2: {
                transport: 250,
                food: 1500,
                admission: 600,
                shopping: 500,
                total: 2850
            },
            day3: {
                transport: 300,
                food: 1200,
                admission: 500,
                shopping: 1000,
                total: 3000
            },
            day4: {
                transport: 250,
                food: 800,
                admission: 0,
                shopping: 1500,
                total: 2550
            }
        }
    };

    // ===================================
    // Calculate Total Budget Per Person
    // ===================================
    function calculateTotalBudget() {
        const daily = Object.values(BUDGET_DATA.dailyBudgets)
            .reduce((sum, day) => sum + day.total, 0);
        
        const easyCard = BUDGET_DATA.transportation.easyCard;
        
        // Accommodation cost per person (if available)
        const accommodation = Object.values(BUDGET_DATA.accommodation)
            .reduce((sum, cost) => sum + cost, 0) / 8;
        
        const total = daily + easyCard + accommodation;
        
        return {
            daily: daily,
            easyCard: easyCard,
            accommodation: accommodation,
            total: total,
            totalHKD: total / BUDGET_DATA.exchangeRate
        };
    }

    // ===================================
    // Calculate Budget Breakdown by Category
    // ===================================
    function calculateByCategory() {
        let transport = BUDGET_DATA.transportation.easyCard;
        let food = 0;
        let admission = 0;
        let shopping = 0;

        Object.values(BUDGET_DATA.dailyBudgets).forEach(day => {
            transport += day.transport;
            food += day.food;
            admission += day.admission;
            shopping += day.shopping;
        });

        return {
            transport: transport,
            food: food,
            admission: admission,
            shopping: shopping,
            accommodation: Object.values(BUDGET_DATA.accommodation)
                .reduce((sum, cost) => sum + cost, 0) / 8
        };
    }

    // ===================================
    // Get Budget for Specific Day
    // ===================================
    function getDayBudget(day) {
        const dayKey = `day${day}`;
        return BUDGET_DATA.dailyBudgets[dayKey] || null;
    }

    // ===================================
    // Convert TWD to HKD
    // ===================================
    function twdToHkd(twd) {
        return twd / BUDGET_DATA.exchangeRate;
    }

    // ===================================
    // Convert HKD to TWD
    // ===================================
    function hkdToTwd(hkd) {
        return hkd * BUDGET_DATA.exchangeRate;
    }

    // ===================================
    // Format Currency
    // ===================================
    function formatTWD(amount) {
        return `NT$${Math.round(amount).toLocaleString('zh-TW')}`;
    }

    function formatHKD(amount) {
        return `HK$${Math.round(amount).toLocaleString('zh-HK')}`;
    }

    // ===================================
    // Render Budget Summary (if container exists)
    // ===================================
    function renderBudgetSummary() {
        const container = document.getElementById('budget-summary');
        if (!container) return;

        const total = calculateTotalBudget();
        const byCategory = calculateByCategory();

        const html = `
            <div class="budget-summary-card">
                <h3>每人預算總覽</h3>
                <div class="budget-total">
                    <p class="budget-amount-twd">${formatTWD(total.total)}</p>
                    <p class="budget-amount-hkd">約 ${formatHKD(total.totalHKD)}</p>
                </div>
                
                <div class="budget-breakdown">
                    <h4>費用分類</h4>
                    <div class="budget-item">
                        <span>交通費</span>
                        <span>${formatTWD(byCategory.transport)}</span>
                    </div>
                    <div class="budget-item">
                        <span>餐飲</span>
                        <span>${formatTWD(byCategory.food)}</span>
                    </div>
                    <div class="budget-item">
                        <span>門票</span>
                        <span>${formatTWD(byCategory.admission)}</span>
                    </div>
                    <div class="budget-item">
                        <span>購物</span>
                        <span>${formatTWD(byCategory.shopping)}</span>
                    </div>
                    ${byCategory.accommodation > 0 ? `
                    <div class="budget-item">
                        <span>住宿</span>
                        <span>${formatTWD(byCategory.accommodation)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // ===================================
    // Render Daily Budget Breakdown
    // ===================================
    function renderDailyBudgets() {
        const container = document.getElementById('daily-budgets');
        if (!container) return;

        let html = '<div class="daily-budgets-grid">';

        for (let day = 1; day <= 4; day++) {
            const budget = getDayBudget(day);
            if (!budget) continue;

            html += `
                <div class="daily-budget-card">
                    <h4>Day ${day}</h4>
                    <div class="budget-items">
                        <div class="budget-item">
                            <span>🚇 交通</span>
                            <span>${formatTWD(budget.transport)}</span>
                        </div>
                        <div class="budget-item">
                            <span>🍜 餐飲</span>
                            <span>${formatTWD(budget.food)}</span>
                        </div>
                        <div class="budget-item">
                            <span>🎫 門票</span>
                            <span>${formatTWD(budget.admission)}</span>
                        </div>
                        <div class="budget-item">
                            <span>🛍️ 購物</span>
                            <span>${formatTWD(budget.shopping)}</span>
                        </div>
                        <div class="budget-item budget-total-item">
                            <strong>小計</strong>
                            <strong>${formatTWD(budget.total)}</strong>
                        </div>
                    </div>
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;
    }

    // ===================================
    // Initialize Budget Calculator
    // ===================================
    function init() {
        console.log('Budget Calculator initialized');
        
        // Render budget components if containers exist
        renderBudgetSummary();
        renderDailyBudgets();

        // Log budget summary to console
        const total = calculateTotalBudget();
        console.log('Total budget per person:', formatTWD(total.total), '≈', formatHKD(total.totalHKD));
    }

    // ===================================
    // Export Functions for Global Access
    // ===================================
    window.TaipeiTravelBudget = {
        init: init,
        calculateTotal: calculateTotalBudget,
        calculateByCategory: calculateByCategory,
        getDayBudget: getDayBudget,
        twdToHkd: twdToHkd,
        hkdToTwd: hkdToTwd,
        formatTWD: formatTWD,
        formatHKD: formatHKD,
        data: BUDGET_DATA
    };

    // ===================================
    // Auto-initialize
    // ===================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
