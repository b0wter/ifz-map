class Markers extends Layer
{
    constructor(map, features, createHighlightText)
    {
        super(map, features, createHighlightText);
        const mAndNMarker = L.marker([-23.543773, -46.625290], { icon: violetIcon, title: "Morals & Nature", opacity: 10 })
        mAndNMarker.bindTooltip("Morals & Nature", { permanent: true, className: "poi-marker", offset: [0, 0], direction: 'center', });

        const markers = [mAndNMarker];
        markers.forEach(element => {
            element.on('click', onMarkerClick);
        });

        const markerLayer = L.layerGroup(markers);
        this.geoJSON = markerLayer;
    }

    get leafletObject()
    {
        return this.geoJSON;
    }
}