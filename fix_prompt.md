BRIEF: bug fix map issue
BUG DESC: Map of the first rendering day works fine but the rest are not rendering properly. By default it renders day 1 map so day 2-4 map does not work. tested by putting directly localhost:8000#day2 to force render day 2 map by dafult and then day 1, 3, 4 map are not working.
REF: 
- READ `docs/js/map.js` on map rendering logic
- READ `docs/index.html` for the related html el
- Fix by refreshing the map of the day on click the day on day-nav