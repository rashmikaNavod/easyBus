export function getMap(mapDiv){
    
    var map = new mapboxgl.Map({
        container: mapDiv, 
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [79.8612, 6.9271], // [Longitude, Latitude] - Colombo, Sri Lanka
        zoom: 13,
        pitch: 20,  // Tilt the map slightly
        bearing: 0  // Initial rotation angle
        });
    
        const bounds = [
        [79.5, 5.8], 
        [82.5, 10.0]             
        ];
        
        map.setMaxBounds(bounds);
        map.addControl(new mapboxgl.NavigationControl());

        document.addEventListener('keydown', function (event) {
            if (event.key === 'q' || event.key === 'Q') {
                map.rotateTo(map.getBearing() - 10); // Rotate left
            } else if (event.key === 'e' || event.key === 'E') {
                map.rotateTo(map.getBearing() + 10); // Rotate right
            }
        });

        return map;
        
}