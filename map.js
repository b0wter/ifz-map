const accessToken = 'QGL5193opsh2qwJCN6b4txetJA13AW1d3ZZ6nhezliTIDuvijFgpXsAHxsXsN8lt';
let map;
let geojson;
let highLightControl;

function onMarkerClick(e) {
    var popup = e.target.getPopup();
    var content = popup.getContent();
    console.log(content);
}

function highlightTooltipText(props) {

}

function initialize() {

    //
    // Create the basic map.
    //
    map = L.map('map').setView([-23.543773, -46.625290], 13);
    const baseLayer = L.tileLayer(
        `https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}.png?access-token=${accessToken}`, {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
        maxZoom: 18
    });
    baseLayer.addTo(map);
    L.control.scale().addTo(map);

    //
    // Add a div to show details for the current selection.
    //
    highLightControl = L.control();
    highLightControl.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this._div.id = "highlightControl";
        this.update();
        return this._div;
    }
    highLightControl.update = function (props) {
        this._div.innerHTML = highlightTooltipText(props);
    }
    highLightControl.addTo(map);

    /*
    // Morals & Nature HQ
    const mAndNMarker = L.marker([-23.543773, -46.625290], { icon: violetIcon, title: "Morals & Nature", opacity: 10 })
    mAndNMarker.bindTooltip("Morals & Nature", { permanent: true, className: "poi-marker", offset: [0, 0], direction: 'center', });

    const markers = [mAndNMarker];
    markers.forEach(element => {
        element.on('click', onMarkerClick);
    });

    const markerLayer = L.layerGroup(markers);
    */


    //
    // Instantiate the optional content.
    //
    const districts = new Districts(map, GEOJson_districts);
    const districtLabels = new DistrictLabels(map, GEOJson_districtLabels);
    const mesoRegion = new MesoRegion(map, GEOJson_mesoRegion.features);

    //
    // Add the optional content to the map.
    //
    var bases = {
        "Base": baseLayer
    }

    var overlays = {
        "Districts": districts.leafletObject,
        "District Labels": districtLabels.leafletObject,
        "Meso Region": mesoRegion.leafletObject,
        //"Markers": markerLayer
    }

    L.control.layers(bases, overlays).addTo(map);

}