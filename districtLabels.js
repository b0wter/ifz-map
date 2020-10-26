class DistrictLabels extends Layer 
{
    constructor(map, features, createHighlightText) 
    {
        super(map, features, createHighlightText);
        this.geoJSON = L.geoJSON(features, { pointToLayer: this.styleMarkers.bind(this) });
        this.geoJSON.minZoom = 9;
        this.geoJSON.maxZoom = 9;
        console.log(this.geoJSON);
    }

    get leafletObject() 
    { 
        return this.geoJSON;
    }    

    styleMarkers(feature, latLng)
    {
        var invisibleMarker = { opacity: 0 }
        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        const marker = L.marker(latLng, invisibleMarker);
        marker.bindTooltip(feature.properties.name, { permanent: true, className: "district-label stroked-text", offset: [0, 0], direction: 'center', });
        return marker;
    }
}