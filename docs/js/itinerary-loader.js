/**
 * Itinerary Loader
 * Dynamically loads and renders itinerary from itinerary_v2.json
 */

(function() {
    'use strict';

    // ===================================
    // Constants
    // ===================================
    const ITINERARY_DATA_URL = 'data/itinerary_v2.json';

    // ===================================
    // Utility Functions
    // ===================================
    
    /**
     * Create an element with classes and optional attributes
     */
    function createElement(tag, classes = [], attributes = {}) {
        const element = document.createElement(tag);
        if (classes.length > 0) {
            element.className = classes.join(' ');
        }
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return element;
    }

    /**
     * Get category icon based on category type
     */
    function getCategoryIcon(category) {
        const icons = {
            'logistics': '📦',
            'attraction': '🎡',
            'food': '🍜',
            'shopping': '🛍️',
            'transport': '🚇',
            'rest': '☕'
        };
        return icons[category] || '📍';
    }

    /**
     * Get category badge class
     */
    function getCategoryBadge(category) {
        const badges = {
            'logistics': 'logistics',
            'attraction': 'attraction',
            'food': 'meal',
            'shopping': 'shopping',
            'transport': 'transport',
            'rest': 'rest'
        };
        return badges[category] || 'default';
    }

    // ===================================
    // Renderers
    // ===================================

    /**
     * Render location information
     */
    function renderLocation(location) {
        if (!location) return '';
        
        const locationDiv = createElement('div', ['activity-location']);
        
        if (location.name) {
            const nameP = createElement('p', ['location-name']);
            nameP.innerHTML = `📍 ${location.name}`;
            locationDiv.appendChild(nameP);
        }
        
        if (location.address) {
            const addressP = createElement('p', ['location-address']);
            addressP.textContent = location.address;
            locationDiv.appendChild(addressP);
        }

        if (location.googleMapQuery) {
            const mapLink = createElement('a', ['location-map-link'], {
                'href': `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.googleMapQuery)}`,
                'target': '_blank',
                'rel': 'noopener noreferrer'
            });
            mapLink.innerHTML = '🗺️ 在 Google Maps 中查看';
            locationDiv.appendChild(mapLink);
        }
        
        return locationDiv;
    }

    /**
     * Render gallery
     */
    function renderGallery(galleryImageUrls) {
        if (!galleryImageUrls || galleryImageUrls.length === 0) return null;
        
        const galleryDiv = createElement('div', ['activity-gallery']);
        const galleryTitle = createElement('h5', ['gallery-title']);
        galleryTitle.textContent = '📸 相關照片';
        galleryDiv.appendChild(galleryTitle);
        
        const galleryGrid = createElement('div', ['gallery-grid']);
        
        galleryImageUrls.forEach((url, index) => {
            const imgWrapper = createElement('div', ['gallery-item']);
            const img = createElement('img', ['gallery-image'], {
                'src': url,
                'alt': `Gallery image ${index + 1}`,
                'loading': 'lazy'
            });
            imgWrapper.appendChild(img);
            galleryGrid.appendChild(imgWrapper);
        });
        
        galleryDiv.appendChild(galleryGrid);
        return galleryDiv;
    }

    /**
     * Render sources/references
     */
    function renderSources(sources) {
        if (!sources || sources.length === 0) return null;
        
        const sourcesDiv = createElement('div', ['activity-sources']);
        const sourcesTitle = createElement('h5', ['sources-title']);
        sourcesTitle.textContent = '🔗 參考資料';
        sourcesDiv.appendChild(sourcesTitle);
        
        const sourcesList = createElement('ul', ['sources-list']);
        
        sources.forEach(source => {
            const li = createElement('li', ['source-item']);
            const link = createElement('a', ['source-link'], {
                'href': source.url,
                'target': '_blank',
                'rel': 'noopener noreferrer'
            });
            link.textContent = source.title;
            li.appendChild(link);
            sourcesList.appendChild(li);
        });
        
        sourcesDiv.appendChild(sourcesList);
        return sourcesDiv;
    }

    /**
     * Render a single agenda item
     */
    function renderAgenda(agenda) {
        const timelineItem = createElement('div', ['timeline-item']);
        
        // Timeline marker
        const marker = createElement('div', ['timeline-marker']);
        const icon = createElement('span', ['timeline-icon']);
        icon.textContent = getCategoryIcon(agenda.category);
        marker.appendChild(icon);
        timelineItem.appendChild(marker);
        
        // Timeline content
        const content = createElement('div', ['timeline-content']);
        const card = createElement('div', ['activity-card', getCategoryBadge(agenda.category)]);
        
        // Header
        const header = createElement('div', ['activity-header']);
        const timeDiv = createElement('div', ['activity-time']);
        timeDiv.textContent = `${agenda.time.start} - ${agenda.time.end}`;
        header.appendChild(timeDiv);
        
        const badge = createElement('span', ['activity-badge', getCategoryBadge(agenda.category)]);
        badge.textContent = agenda.category;
        header.appendChild(badge);
        card.appendChild(header);
        
        // Title
        const title = createElement('h4', ['activity-title']);
        title.textContent = agenda.title;
        card.appendChild(title);
        
        // Details section
        const details = createElement('div', ['activity-details']);
        
        // Location
        const locationElement = renderLocation(agenda.location);
        if (locationElement) {
            details.appendChild(locationElement);
        }
        
        // What to do
        if (agenda.whatToDo) {
            const whatToDoDiv = createElement('div', ['activity-description']);
            const whatToDoTitle = createElement('h5', ['description-title']);
            whatToDoTitle.innerHTML = '📝 活動內容';
            whatToDoDiv.appendChild(whatToDoTitle);
            
            const whatToDoText = createElement('p', ['description-text']);
            whatToDoText.textContent = agenda.whatToDo;
            whatToDoDiv.appendChild(whatToDoText);
            details.appendChild(whatToDoDiv);
        }
        
        // Why go
        if (agenda.whyGo) {
            const whyGoDiv = createElement('div', ['activity-why']);
            const whyGoTitle = createElement('h5', ['why-title']);
            whyGoTitle.innerHTML = '💡 為什麼要去';
            whyGoDiv.appendChild(whyGoTitle);
            
            const whyGoText = createElement('p', ['why-text']);
            whyGoText.textContent = agenda.whyGo;
            whyGoDiv.appendChild(whyGoText);
            details.appendChild(whyGoDiv);
        }
        
        // Things to pay attention
        if (agenda.thingsToPayAttention && agenda.thingsToPayAttention.length > 0) {
            const attentionDiv = createElement('div', ['activity-attention']);
            const attentionTitle = createElement('h5', ['attention-title']);
            attentionTitle.innerHTML = '⚠️ 注意事項';
            attentionDiv.appendChild(attentionTitle);
            
            const attentionList = createElement('ul', ['attention-list']);
            agenda.thingsToPayAttention.forEach(item => {
                const li = createElement('li', ['attention-item']);
                li.textContent = item;
                attentionList.appendChild(li);
            });
            attentionDiv.appendChild(attentionList);
            details.appendChild(attentionDiv);
        }
        
        card.appendChild(details);
        
        // Gallery
        const gallery = renderGallery(agenda.galleryImageUrls);
        if (gallery) {
            card.appendChild(gallery);
        }
        
        // Sources
        const sources = renderSources(agenda.sources);
        if (sources) {
            card.appendChild(sources);
        }
        
        // Transport suggestion (if available)
        if (agenda.suggestedTransport) {
            const footer = createElement('div', ['activity-footer']);
            const transportTag = createElement('span', ['transport-tag']);
            
            if (agenda.suggestedTransport.walkMinutes) {
                transportTag.innerHTML = `🚶 步行約 ${agenda.suggestedTransport.walkMinutes} 分鐘`;
            } else if (agenda.suggestedTransport.taxiMinutes) {
                transportTag.innerHTML = `🚕 計程車約 ${agenda.suggestedTransport.taxiMinutes} 分鐘`;
            } else if (agenda.suggestedTransport.recommended) {
                transportTag.innerHTML = `🚇 ${agenda.suggestedTransport.recommended}`;
            }
            
            footer.appendChild(transportTag);
            card.appendChild(footer);
        }
        
        content.appendChild(card);
        timelineItem.appendChild(content);
        
        return timelineItem;
    }

    /**
     * Render map section for a day
     */
    function renderDayMap(dayMap, dayNumber) {
        if (!dayMap) return null;
        
        const mapSection = createElement('div', ['map-section']);
        
        const mapTitle = createElement('h4', ['map-title']);
        mapTitle.innerHTML = `📍 第${['一', '二', '三', '四'][dayNumber - 1]}天景點地圖`;
        mapSection.appendChild(mapTitle);
        
        const mapContainer = createElement('div', ['map-container'], {
            'id': `map-day${dayNumber}`,
            'data-center-lat': dayMap.center.lat,
            'data-center-lng': dayMap.center.lng,
            'data-markers': JSON.stringify(dayMap.markers)
        });
        mapSection.appendChild(mapContainer);
        
        const mapHint = createElement('p', ['map-hint']);
        mapHint.textContent = '💡 點擊標記查看詳細資訊和 Google 地圖連結';
        mapSection.appendChild(mapHint);
        
        return mapSection;
    }

    /**
     * Render a single day
     */
    function renderDay(day) {
        const daySection = createElement('div', ['day-section'], { 'id': `day${day.day}` });
        
        // Day header
        const dayHeader = createElement('div', ['day-header']);
        
        const dayNumber = createElement('div', ['day-number']);
        dayNumber.textContent = `Day ${day.day}`;
        dayHeader.appendChild(dayNumber);
        
        const dayInfo = createElement('div', ['day-info']);
        const dayTitle = createElement('h3', ['day-title']);
        dayTitle.textContent = `${day.area} 🎄`;
        dayInfo.appendChild(dayTitle);
        
        const dayDate = createElement('p', ['day-date']);
        dayDate.textContent = day.date;
        dayInfo.appendChild(dayDate);
        dayHeader.appendChild(dayInfo);
        
        daySection.appendChild(dayHeader);
        
        // Map section
        const mapSection = renderDayMap(day.dayMap, day.day);
        if (mapSection) {
            daySection.appendChild(mapSection);
        }
        
        // Timeline
        const timeline = createElement('div', ['timeline']);
        
        // Render each agenda
        if (day.agendas && day.agendas.length > 0) {
            day.agendas.forEach(agenda => {
                const agendaElement = renderAgenda(agenda);
                timeline.appendChild(agendaElement);
            });
        }
        
        daySection.appendChild(timeline);
        
        return daySection;
    }

    /**
     * Render all days
     */
    function renderAllDays(data) {
        const itineraryContainer = document.getElementById('itinerary-content');
        if (!itineraryContainer) {
            console.error('Itinerary container not found');
            return;
        }
        
        // Clear existing content
        itineraryContainer.innerHTML = '';
        
        // Render each day
        if (data.days && data.days.length > 0) {
            data.days.forEach(day => {
                const dayElement = renderDay(day);
                itineraryContainer.appendChild(dayElement);
            });
        }
    }

    /**
     * Load itinerary data
     */
    async function loadItinerary() {
        try {
            const response = await fetch(ITINERARY_DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            renderAllDays(data);
            console.log('Itinerary loaded successfully');
            
            // Initialize maps after a short delay to ensure DOM is ready
            setTimeout(() => {
                if (window.initializeDynamicMaps) {
                    window.initializeDynamicMaps();
                }
            }, 200);
        } catch (error) {
            console.error('Error loading itinerary:', error);
            
            // Show error message to user
            const itineraryContainer = document.getElementById('itinerary-content');
            if (itineraryContainer) {
                itineraryContainer.innerHTML = `
                    <div class="error-message">
                        <p>⚠️ 無法載入行程資料，請稍後再試。</p>
                    </div>
                `;
            }
        }
    }

    // ===================================
    // Initialization
    // ===================================
    
    // Load itinerary when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadItinerary);
    } else {
        loadItinerary();
    }

    // Export for debugging
    window.ItineraryLoader = {
        reload: loadItinerary
    };

})();
