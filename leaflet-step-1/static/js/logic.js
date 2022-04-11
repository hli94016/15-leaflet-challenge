
// link: https://docs.mapbox.com/mapbox.js/example/v1.0.0/plain-leaflet/
const mapConfig = {
    attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    tileSize: 512,
    zoomOffset: -1,
    id: 'mapbox/light-v10',
    accessToken: API_KEY
}
const mapboxTiles = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", mapConfig);

const map = L.map('map')
             .addLayer(mapboxTiles)
             .setView([45.52, -122.67], 5);

const dataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
d3.json(dataUrl).then(data => {
    const getColorByDepth = depth => {
        if (-10 <= depth && depth <= 10) {
            return '#98ee00';
        } else if (11 <= depth && depth <= 30) {
            return '#26CF08';
        } else if (31 <= depth && depth <= 50) {
            return '#A8D30F'
        } else if (51 <= depth && depth <= 70) {
            return '#E88A14';
        } else if (71 <= depth && depth <= 90) {
            return '#EA6D1B';
        } else if (depth >= 91) {
            return '#F5160B';
        }
    };
    L.geoJson(data, {
        pointToLayer: (_, latitude) => L.circleMarker(latitude),
        style: feature => ({
            weight: 0.5,
            color: "#98ee00",
            fillOpacity: 1,
            fillColor: getColorByDepth(feature.geometry.coordinates[2]),
            stroke: true,
            radius: feature.properties.mag === 0 ? 1 : feature.properties.mag * 4
        }),
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<h3>Place: ${feature.properties.place}, Magnitude: ${feature.properties.mag}, Depth: ${feature.geometry.coordinates[2]}`);
        }
    }).addTo(map);
});