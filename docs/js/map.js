/**
 * Taipei Christmas Travel Guide 2025
 * Map Integration JavaScript - Leaflet.js
 * Handles interactive maps for locations and attractions
 */

(function() {
    'use strict';

    // ===================================
    // Location Data for Each Day
    // ===================================
    
    // Day 1 Locations (12月25日)
    const day1Locations = [
        {
            name: '台北101',
            type: 'attraction',
            icon: '🏙️',
            coords: [25.0340, 121.5645],
            description: '觀景台 + 購物中心',
            googleMaps: 'https://goo.gl/maps/Taipei101'
        },
        {
            name: '鼎泰豐（信義店）',
            type: 'food',
            icon: '🥟',
            coords: [25.0339, 121.5645],
            description: '必吃小籠包',
            googleMaps: 'https://goo.gl/maps/DinTaiFung'
        },
        {
            name: '饒河街夜市',
            type: 'food',
            icon: '🍜',
            coords: [25.0511, 121.5775],
            description: '必吃：胡椒餅、藥燉排骨',
            googleMaps: 'https://goo.gl/maps/RaoheNightMarket'
        },
        {
            name: '西門町',
            type: 'attraction',
            icon: '🛍️',
            coords: [25.0421, 121.5071],
            description: '聖誕氛圍 + 動漫周邊',
            googleMaps: 'https://goo.gl/maps/Ximending'
        },
        {
            name: '台北見潭璞旅',
            type: 'hotel',
            icon: '🏨',
            coords: [25.0330, 121.5654],
            description: '住宿酒店（12/25-26）',
            googleMaps: 'https://goo.gl/maps/TaipeiHotel'
        }
    ];

    // Day 2 Locations (12月26日)
    const day2Locations = [
        {
            name: '臺北市立兒童新樂園',
            type: 'attraction',
            icon: '🎡',
            coords: [25.0968, 121.5156],
            description: '必玩咖啡杯！',
            googleMaps: 'https://goo.gl/maps/ChildrensAmusementPark'
        },
        {
            name: '士林夜市',
            type: 'food',
            icon: '🍗',
            coords: [25.0881, 121.5240],
            description: '大餅包小餅、豪大雞排',
            googleMaps: 'https://goo.gl/maps/ShilinNightMarket'
        },
        {
            name: '國立故宮博物院',
            type: 'attraction',
            icon: '🏛️',
            coords: [25.1024, 121.5484],
            description: '翠玉白菜、肉形石',
            googleMaps: 'https://goo.gl/maps/NationalPalaceMuseum'
        },
        {
            name: '欣葉台菜（中山店）',
            type: 'food',
            icon: '🍽️',
            coords: [25.0625, 121.5243],
            description: '經典台菜晚餐',
            googleMaps: 'https://goo.gl/maps/ShinYeh'
        },
        {
            name: '寧夏夜市',
            type: 'food',
            icon: '🍜',
            coords: [25.0565, 121.5154],
            description: '傳統台灣小吃',
            googleMaps: 'https://goo.gl/maps/NingxiaNightMarket'
        }
    ];

    // Day 3 Locations (12月27日)
    const day3Locations = [
        {
            name: '北投溫泉博物館',
            type: 'attraction',
            icon: '🏛️',
            coords: [25.1367, 121.5084],
            description: '日式建築、溫泉歷史',
            googleMaps: 'https://goo.gl/maps/BeitouMuseum'
        },
        {
            name: '地熱谷',
            type: 'attraction',
            icon: '♨️',
            coords: [25.1373, 121.5116],
            description: '溫泉源頭、硫磺煙霧',
            googleMaps: 'https://goo.gl/maps/GeothermalValley'
        },
        {
            name: '淡水老街',
            type: 'attraction',
            icon: '🏮',
            coords: [25.1688, 121.4458],
            description: '淡水阿給、魚丸湯',
            googleMaps: 'https://goo.gl/maps/TamsuiOldStreet'
        },
        {
            name: '漁人碼頭',
            type: 'attraction',
            icon: '🌅',
            coords: [25.1820, 121.4172],
            description: '情人橋、夕陽海景',
            googleMaps: 'https://goo.gl/maps/FishermansWharf'
        },
        {
            name: '北投天玥泉會館',
            type: 'hotel',
            icon: '♨️',
            coords: [25.1373, 121.5059],
            description: '溫泉酒店（12/27）',
            googleMaps: 'https://goo.gl/maps/BeitouHotel'
        }
    ];

    // Day 4 Locations (12月28日)
    const day4Locations = [
        {
            name: '九份老街',
            type: 'attraction',
            icon: '🏮',
            coords: [25.1094, 121.8449],
            description: '千與千尋場景、芋圓',
            googleMaps: 'https://goo.gl/maps/Jiufen'
        },
        {
            name: '桃園國際機場',
            type: 'transport',
            icon: '✈️',
            coords: [25.0777, 121.2328],
            description: '21:10 起飛返港',
            googleMaps: 'https://goo.gl/maps/TPEAirport'
        }
    ];

    // ===================================
    // Map Initialization Functions
    // ===================================
    
    function createCustomIcon(emoji, type) {
        const iconHtml = `
            <div class="custom-marker ${type}-marker">
                ${emoji}
            </div>
        `;
        
        return L.divIcon({
            html: iconHtml,
            className: 'custom-div-icon',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18]
        });
    }

    function createPopupContent(location) {
        const typeLabels = {
            hotel: '住宿',
            attraction: '景點',
            food: '美食',
            transport: '交通'
        };
        
        return `
            <div class="map-popup">
                <h5>${location.icon} ${location.name}</h5>
                <span class="popup-type ${location.type}">${typeLabels[location.type]}</span>
                <p class="popup-description">${location.description}</p>
                <a href="${location.googleMaps}" target="_blank" rel="noopener noreferrer" class="popup-link">
                    📍 在 Google 地圖中查看
                </a>
            </div>
        `;
    }

    function initializeMap(mapId, locations) {
        // Check if map container exists
        const mapContainer = document.getElementById(mapId);
        if (!mapContainer) {
            console.warn(`Map container ${mapId} not found`);
            return null;
        }

        // Calculate center based on locations
        let centerLat = 0;
        let centerLng = 0;
        locations.forEach(loc => {
            centerLat += loc.coords[0];
            centerLng += loc.coords[1];
        });
        centerLat /= locations.length;
        centerLng /= locations.length;

        // Initialize map
        const map = L.map(mapId).setView([centerLat, centerLng], 12);

        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        // Add markers for each location
        const markers = [];
        locations.forEach(location => {
            const icon = createCustomIcon(location.icon, location.type);
            const marker = L.marker(location.coords, { icon: icon })
                .addTo(map)
                .bindPopup(createPopupContent(location));
            
            markers.push(marker);
        });

        // Store marker group for bounds fitting
        let markerGroup = null;
        if (markers.length > 0) {
            markerGroup = L.featureGroup(markers);
            map.fitBounds(markerGroup.getBounds().pad(0.1));
        }

        // Store marker group with map instance for later use
        map.markerGroup = markerGroup;

        return map;
    }

    // ===================================
    // Initialize All Maps
    // ===================================
    
    // Store map instances globally
    const mapInstances = {};
    
    /**
     * Initialize maps from dynamic data (used with itinerary_v2.json)
     */
    function initializeDynamicMaps() {
        // Wait for Leaflet to be loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet library not loaded');
            return;
        }
        
        // Find all map containers
        const mapContainers = document.querySelectorAll('.map-container');
        
        mapContainers.forEach(container => {
            const mapId = container.id;
            const centerLat = parseFloat(container.dataset.centerLat);
            const centerLng = parseFloat(container.dataset.centerLng);
            const markersData = JSON.parse(container.dataset.markers || '[]');
            
            if (!mapId || !centerLat || !centerLng) {
                console.warn('Missing map data for', mapId);
                return;
            }
            
            // Convert markers data to location format
            const locations = markersData.map(marker => ({
                name: marker.title,
                type: 'attraction', // Default type
                icon: '📍',
                coords: [marker.lat, marker.lng],
                description: marker.title,
                googleMaps: `https://www.google.com/maps/search/?api=1&query=${marker.lat},${marker.lng}`
            }));
            
            // Initialize the map
            if (locations.length > 0) {
                mapInstances[mapId] = initializeMap(mapId, locations);
            }
        });
        
        console.log('Dynamic maps initialized');
    }
    
    // Expose the function globally
    window.initializeDynamicMaps = initializeDynamicMaps;
    
    function initializeMaps() {
        // Wait for Leaflet to be loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet library not loaded');
            return;
        }

        // Initialize maps for each day
        try {
            mapInstances['map-day1'] = initializeMap('map-day1', day1Locations);
            mapInstances['map-day2'] = initializeMap('map-day2', day2Locations);
            mapInstances['map-day3'] = initializeMap('map-day3', day3Locations);
            mapInstances['map-day4'] = initializeMap('map-day4', day4Locations);
            
            console.log('All maps initialized successfully');
        } catch (error) {
            console.error('Error initializing maps:', error);
        }
    }
    
    // Function to refresh map when its container becomes visible
    function refreshMap(mapId) {
        if (mapInstances[mapId]) {
            setTimeout(() => {
                const map = mapInstances[mapId];
                map.invalidateSize();
                // Re-fit bounds to show all markers properly
                if (map.markerGroup) {
                    map.fitBounds(map.markerGroup.getBounds().pad(0.1));
                }
            }, 100);
        }
    }
    
    // Expose refresh function globally for use in main.js
    window.refreshDayMap = function(dayNumber) {
        const mapId = `map-day${dayNumber}`;
        refreshMap(mapId);
    };

    // ===================================
    // Event Listeners
    // ===================================
    
    // Initialize maps when DOM is ready and Leaflet is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Small delay to ensure Leaflet is fully loaded
            setTimeout(initializeMaps, 100);
        });
    } else {
        setTimeout(initializeMaps, 100);
    }

    // Re-initialize maps when day sections become visible
    // (in case they're in tabs/accordions)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.style.display !== 'none' && target.classList.contains('day-section')) {
                    // Map container became visible, invalidate size
                    const mapId = target.querySelector('.map-container')?.id;
                    if (mapId && mapInstances[mapId]) {
                        refreshMap(mapId);
                    }
                }
            }
        });
    });

    // Observe day sections for visibility changes
    document.addEventListener('DOMContentLoaded', function() {
        const daySections = document.querySelectorAll('.day-section');
        daySections.forEach(section => {
            observer.observe(section, { attributes: true });
        });
    });

})();
