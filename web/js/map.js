/**
 * Taipei Christmas Travel Guide 2025
 * Map Integration JavaScript
 * Handles interactive maps for locations and attractions
 */

(function() {
    'use strict';

    // ===================================
    // Map Configuration
    // ===================================
    const MAP_CONFIG = {
        // Taipei coordinates
        center: {
            lat: 25.0330,
            lng: 121.5654
        },
        zoom: 12,
        // Map styles (can be customized)
        styles: []
    };

    // ===================================
    // Location Data
    // ===================================
    const LOCATIONS = {
        // Accommodations
        hotels: [
            {
                id: 'hotel-1',
                name: '台北見潭璞旅',
                type: 'hotel',
                coordinates: null, // To be filled when actual address is available
                address: '需確認具體位置',
                dates: '12月25-26日'
            },
            {
                id: 'hotel-2',
                name: '台北北投天玥泉會館',
                type: 'hotel',
                coordinates: { lat: 25.1373, lng: 121.5059 }, // Approximate Beitou coordinates
                address: '台北市北投區',
                dates: '12月27日',
                special: '溫泉會館'
            }
        ],
        
        // Attractions (to be expanded in future steps)
        attractions: [
            {
                id: 'taipei-101',
                name: '台北101',
                type: 'attraction',
                coordinates: { lat: 25.0340, lng: 121.5645 },
                address: '台北市信義區信義路五段7號',
                day: 1
            },
            {
                id: 'childrens-amusement-park',
                name: '臺北市立兒童新樂園',
                type: 'attraction',
                coordinates: { lat: 25.0963, lng: 121.5156 },
                address: '台北市士林區承德路五段55號',
                day: 2,
                highlight: '咖啡杯'
            },
            {
                id: 'national-palace-museum',
                name: '國立故宮博物院',
                type: 'attraction',
                coordinates: { lat: 25.1023, lng: 121.5485 },
                address: '台北市士林區至善路二段221號',
                day: 2
            }
        ],
        
        // Night Markets (to be expanded)
        nightMarkets: [
            {
                id: 'raohe-night-market',
                name: '饒河街夜市',
                type: 'food',
                coordinates: { lat: 25.0509, lng: 121.5778 },
                address: '台北市松山區饒河街',
                day: 1
            },
            {
                id: 'shilin-night-market',
                name: '士林夜市',
                type: 'food',
                coordinates: { lat: 25.0878, lng: 121.5241 },
                address: '台北市士林區',
                day: 2
            }
        ]
    };

    // ===================================
    // Initialize Map (Google Maps placeholder)
    // ===================================
    function initMap() {
        // This is a placeholder function
        // Actual Google Maps integration will be implemented in future steps
        // For now, we'll just log that the map module is ready
        
        console.log('Map module initialized');
        console.log('Total locations:', getAllLocations().length);
        
        // Check if Google Maps API is loaded
        if (typeof google !== 'undefined' && google.maps) {
            console.log('Google Maps API is available');
            createMap();
        } else {
            console.log('Google Maps API not loaded - map features will be added in future steps');
        }
    }

    // ===================================
    // Create Map Instance
    // ===================================
    function createMap() {
        const mapContainer = document.getElementById('map');
        
        if (!mapContainer) {
            console.log('Map container not found');
            return;
        }

        // Create map instance
        const map = new google.maps.Map(mapContainer, {
            center: MAP_CONFIG.center,
            zoom: MAP_CONFIG.zoom,
            styles: MAP_CONFIG.styles
        });

        // Add markers for all locations
        addMarkers(map);
    }

    // ===================================
    // Add Markers to Map
    // ===================================
    function addMarkers(map) {
        const allLocations = getAllLocations();
        
        allLocations.forEach(location => {
            if (!location.coordinates) return;

            const marker = new google.maps.Marker({
                position: location.coordinates,
                map: map,
                title: location.name,
                icon: getMarkerIcon(location.type)
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: createInfoWindowContent(location)
            });

            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });
        });
    }

    // ===================================
    // Get Marker Icon Based on Type
    // ===================================
    function getMarkerIcon(type) {
        const icons = {
            hotel: {
                url: 'images/icons/hotel-marker.png',
                scaledSize: new google.maps.Size(32, 32)
            },
            attraction: {
                url: 'images/icons/attraction-marker.png',
                scaledSize: new google.maps.Size(32, 32)
            },
            food: {
                url: 'images/icons/food-marker.png',
                scaledSize: new google.maps.Size(32, 32)
            }
        };

        return icons[type] || null;
    }

    // ===================================
    // Create Info Window Content
    // ===================================
    function createInfoWindowContent(location) {
        let content = `
            <div class="map-info-window">
                <h3>${location.name}</h3>
                <p><strong>地址:</strong> ${location.address}</p>
        `;

        if (location.dates) {
            content += `<p><strong>日期:</strong> ${location.dates}</p>`;
        }

        if (location.day) {
            content += `<p><strong>Day ${location.day}</strong></p>`;
        }

        if (location.special) {
            content += `<p><strong>特色:</strong> ${location.special}</p>`;
        }

        if (location.highlight) {
            content += `<p><strong>亮點:</strong> ${location.highlight}</p>`;
        }

        content += `</div>`;

        return content;
    }

    // ===================================
    // Get All Locations
    // ===================================
    function getAllLocations() {
        return [
            ...LOCATIONS.hotels,
            ...LOCATIONS.attractions,
            ...LOCATIONS.nightMarkets
        ];
    }

    // ===================================
    // Get Locations by Day
    // ===================================
    function getLocationsByDay(day) {
        return getAllLocations().filter(location => location.day === day);
    }

    // ===================================
    // Get Locations by Type
    // ===================================
    function getLocationsByType(type) {
        return getAllLocations().filter(location => location.type === type);
    }

    // ===================================
    // Calculate Distance Between Two Points
    // ===================================
    function calculateDistance(lat1, lng1, lat2, lng2) {
        // Haversine formula
        const R = 6371; // Radius of the Earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLng = deg2rad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // ===================================
    // Export Functions for Global Access
    // ===================================
    window.TaipeiTravelMap = {
        init: initMap,
        getLocations: getAllLocations,
        getLocationsByDay: getLocationsByDay,
        getLocationsByType: getLocationsByType,
        calculateDistance: calculateDistance
    };

    // ===================================
    // Auto-initialize if map container exists
    // ===================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMap);
    } else {
        initMap();
    }

})();
