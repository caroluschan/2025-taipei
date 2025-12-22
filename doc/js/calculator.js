/**
 * Taipei Christmas Travel Guide 2025
 * Budget Calculator JavaScript
 * Handles interactive budget calculation and currency conversion
 */

(function() {
    'use strict';

    // ===================================
    // Budget Configuration
    // ===================================
    const BUDGET_CONFIG = {
        exchangeRate: 4.0, // 1 HKD ≈ 4 TWD
        
        // Fixed costs (min-max per person in TWD)
        fixed: {
            transport: [1000, 1700],
            meals: [2500, 4000],
            tickets: [1150, 1250],
            accommodation: [4500, 6500]
        },
        
        // Category percentages for chart (based on average)
        categories: {
            accommodation: 0,
            meals: 0,
            transport: 0,
            tickets: 0,
            other: 0
        }
    };

    // ===================================
    // State Management
    // ===================================
    let calculatorState = {
        optionalItems: {},
        customAmounts: {
            shopping: 1000,
            souvenir: 500,
            emergency: 1000
        },
        showHKD: false
    };

    // ===================================
    // DOM Elements
    // ===================================
    let elements = {};

    // ===================================
    // Initialization
    // ===================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCalculator);
        } else {
            initCalculator();
        }
    }

    function initCalculator() {
        // Get DOM elements
        elements = {
            optionalCheckboxes: document.querySelectorAll('.budget-checkbox.optional'),
            customInputs: document.querySelectorAll('.custom-amount'),
            toggleCurrencyBtn: document.getElementById('toggle-currency'),
            printBtn: document.getElementById('print-budget'),
            resetBtn: document.getElementById('reset-budget'),
            
            // Summary displays
            fixedCost: document.getElementById('fixed-cost'),
            optionalCost: document.getElementById('optional-cost'),
            customCost: document.getElementById('custom-cost'),
            totalPerPerson: document.getElementById('total-per-person'),
            totalGroup: document.getElementById('total-group'),
            
            // Chart bars
            barAccommodation: document.getElementById('bar-accommodation'),
            barMeals: document.getElementById('bar-meals'),
            barTransport: document.getElementById('bar-transport'),
            barTickets: document.getElementById('bar-tickets'),
            barOther: document.getElementById('bar-other'),
            
            // Chart percentages
            percentAccommodation: document.getElementById('percent-accommodation'),
            percentMeals: document.getElementById('percent-meals'),
            percentTransport: document.getElementById('percent-transport'),
            percentTickets: document.getElementById('percent-tickets'),
            percentOther: document.getElementById('percent-other')
        };

        // Initialize optional items state
        elements.optionalCheckboxes.forEach(checkbox => {
            calculatorState.optionalItems[checkbox.id] = checkbox.checked;
        });

        // Add event listeners
        addEventListeners();
        
        // Initial calculation
        calculateBudget();
    }

    // ===================================
    // Event Listeners
    // ===================================
    function addEventListeners() {
        // Optional checkboxes
        elements.optionalCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleOptionalChange);
        });

        // Custom inputs
        elements.customInputs.forEach(input => {
            input.addEventListener('input', handleCustomAmountChange);
        });

        // Currency toggle
        if (elements.toggleCurrencyBtn) {
            elements.toggleCurrencyBtn.addEventListener('click', toggleCurrency);
        }

        // Print button
        if (elements.printBtn) {
            elements.printBtn.addEventListener('click', printBudget);
        }

        // Reset button
        if (elements.resetBtn) {
            elements.resetBtn.addEventListener('click', resetCalculator);
        }
    }

    // ===================================
    // Event Handlers
    // ===================================
    function handleOptionalChange(event) {
        const checkbox = event.target;
        calculatorState.optionalItems[checkbox.id] = checkbox.checked;
        calculateBudget();
    }

    function handleCustomAmountChange(event) {
        const input = event.target;
        const key = input.id.replace('-budget', '').replace('-fund', '');
        calculatorState.customAmounts[key === 'emergency' ? 'emergency' : key] = parseInt(input.value) || 0;
        calculateBudget();
    }

    function toggleCurrency() {
        calculatorState.showHKD = !calculatorState.showHKD;
        elements.toggleCurrencyBtn.textContent = calculatorState.showHKD ? 
            '切換為台幣顯示' : '切換為港幣顯示';
        updateDisplay();
    }

    function printBudget() {
        window.print();
    }

    function resetCalculator() {
        // Reset optional items
        elements.optionalCheckboxes.forEach(checkbox => {
            if (checkbox.id === 'fine-dining') {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
            calculatorState.optionalItems[checkbox.id] = checkbox.checked;
        });

        // Reset custom amounts
        calculatorState.customAmounts = {
            shopping: 1000,
            souvenir: 500,
            emergency: 1000
        };
        
        elements.customInputs.forEach(input => {
            if (input.id === 'shopping-budget') input.value = 1000;
            if (input.id === 'souvenir-budget') input.value = 500;
            if (input.id === 'emergency-fund') input.value = 1000;
        });

        calculateBudget();
    }

    // ===================================
    // Budget Calculation
    // ===================================
    function calculateBudget() {
        // Calculate fixed costs total
        const fixedMin = BUDGET_CONFIG.fixed.transport[0] + 
                        BUDGET_CONFIG.fixed.meals[0] + 
                        BUDGET_CONFIG.fixed.tickets[0] + 
                        BUDGET_CONFIG.fixed.accommodation[0];
        const fixedMax = BUDGET_CONFIG.fixed.transport[1] + 
                        BUDGET_CONFIG.fixed.meals[1] + 
                        BUDGET_CONFIG.fixed.tickets[1] + 
                        BUDGET_CONFIG.fixed.accommodation[1];

        // Calculate optional costs
        let optionalMin = 0;
        let optionalMax = 0;
        elements.optionalCheckboxes.forEach(checkbox => {
            if (calculatorState.optionalItems[checkbox.id]) {
                const min = parseInt(checkbox.dataset.min) || 0;
                const max = parseInt(checkbox.dataset.max) || 0;
                optionalMin += min;
                optionalMax += max;
            }
        });

        // Calculate custom amounts total
        const customTotal = calculatorState.customAmounts.shopping + 
                           calculatorState.customAmounts.souvenir + 
                           calculatorState.customAmounts.emergency;

        // Calculate totals
        const totalMin = fixedMin + optionalMin + customTotal;
        const totalMax = fixedMax + optionalMax + customTotal;
        const groupMin = totalMin * 8;
        const groupMax = totalMax * 8;

        // Store results
        const results = {
            fixed: { min: fixedMin, max: fixedMax },
            optional: { min: optionalMin, max: optionalMax },
            custom: customTotal,
            perPerson: { min: totalMin, max: totalMax },
            group: { min: groupMin, max: groupMax }
        };

        // Update chart percentages
        updateChartData(results.perPerson.min, results.perPerson.max);

        // Update display
        updateDisplay(results);
    }

    // ===================================
    // Chart Update
    // ===================================
    function updateChartData(totalMin, totalMax) {
        const totalAvg = (totalMin + totalMax) / 2;
        
        // Calculate averages for each category
        const accommodationAvg = (BUDGET_CONFIG.fixed.accommodation[0] + BUDGET_CONFIG.fixed.accommodation[1]) / 2;
        const mealsAvg = (BUDGET_CONFIG.fixed.meals[0] + BUDGET_CONFIG.fixed.meals[1]) / 2;
        const transportAvg = (BUDGET_CONFIG.fixed.transport[0] + BUDGET_CONFIG.fixed.transport[1]) / 2;
        const ticketsAvg = (BUDGET_CONFIG.fixed.tickets[0] + BUDGET_CONFIG.fixed.tickets[1]) / 2;
        const otherAvg = totalAvg - accommodationAvg - mealsAvg - transportAvg - ticketsAvg;

        // Calculate percentages
        const percentages = {
            accommodation: (accommodationAvg / totalAvg * 100).toFixed(0),
            meals: (mealsAvg / totalAvg * 100).toFixed(0),
            transport: (transportAvg / totalAvg * 100).toFixed(0),
            tickets: (ticketsAvg / totalAvg * 100).toFixed(0),
            other: (otherAvg / totalAvg * 100).toFixed(0)
        };

        // Update chart bars
        if (elements.barAccommodation) {
            elements.barAccommodation.style.width = percentages.accommodation + '%';
            elements.percentAccommodation.textContent = percentages.accommodation + '%';
        }
        if (elements.barMeals) {
            elements.barMeals.style.width = percentages.meals + '%';
            elements.percentMeals.textContent = percentages.meals + '%';
        }
        if (elements.barTransport) {
            elements.barTransport.style.width = percentages.transport + '%';
            elements.percentTransport.textContent = percentages.transport + '%';
        }
        if (elements.barTickets) {
            elements.barTickets.style.width = percentages.tickets + '%';
            elements.percentTickets.textContent = percentages.tickets + '%';
        }
        if (elements.barOther) {
            elements.barOther.style.width = percentages.other + '%';
            elements.percentOther.textContent = percentages.other + '%';
        }
    }

    // ===================================
    // Display Update
    // ===================================
    function updateDisplay(results) {
        if (!results) {
            // Recalculate if no results passed
            calculateBudget();
            return;
        }

        const currency = calculatorState.showHKD ? 'HK$' : 'NT$';
        const rate = calculatorState.showHKD ? BUDGET_CONFIG.exchangeRate : 1;

        // Update fixed cost
        if (elements.fixedCost) {
            const min = Math.round(results.fixed.min / rate);
            const max = Math.round(results.fixed.max / rate);
            elements.fixedCost.textContent = `${currency} ${min.toLocaleString()}-${max.toLocaleString()}`;
        }

        // Update optional cost
        if (elements.optionalCost) {
            const min = Math.round(results.optional.min / rate);
            const max = Math.round(results.optional.max / rate);
            elements.optionalCost.textContent = `${currency} ${min.toLocaleString()}-${max.toLocaleString()}`;
        }

        // Update custom cost
        if (elements.customCost) {
            const custom = Math.round(results.custom / rate);
            elements.customCost.textContent = `${currency} ${custom.toLocaleString()}`;
        }

        // Update total per person
        if (elements.totalPerPerson) {
            const min = Math.round(results.perPerson.min / rate);
            const max = Math.round(results.perPerson.max / rate);
            elements.totalPerPerson.textContent = `${currency} ${min.toLocaleString()}-${max.toLocaleString()}`;
        }

        // Update group total
        if (elements.totalGroup) {
            const min = Math.round(results.group.min / rate);
            const max = Math.round(results.group.max / rate);
            elements.totalGroup.textContent = `${currency} ${min.toLocaleString()}-${max.toLocaleString()}`;
        }
    }

    // ===================================
    // Initialize on Load
    // ===================================
    init();

})();
