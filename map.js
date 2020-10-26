const accessToken = 'QGL5193opsh2qwJCN6b4txetJA13AW1d3ZZ6nhezliTIDuvijFgpXsAHxsXsN8lt';
let map;
let geojson;
let highLightControl;

function onMarkerClick(e) {
    var popup = e.target.getPopup();
    var content = popup.getContent();
    console.log(content);
}

function initialize() {

    //
    // Create the basic map.
    //
    map = L.map('map').setView([-23.543773, -46.625290], 13);

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
    highLightControl.update = function (text) {
        this._div.innerHTML = text;
    }
    highLightControl.addTo(map);
    const highlightUpdater = (function (text) {
        highLightControl.update(text);
    }).bind(this);

    // Add a scle.
    L.control.scale().addTo(map);

    //
    // Load the different layers.
    //
    var baseLayerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
	    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	    subdomains: 'abcd',
	    minZoom: 9,
	    maxZoom: 18,
	    ext: 'png'
    });
    baseLayerBackground.addTo(map);

    var baseLayerDarkBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}{r}.{ext}', {
	    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	    subdomains: 'abcd',
	    minZoom: 9,
	    maxZoom: 18,
	    ext: 'png'
    });

    var baseLayerTerrainBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	    subdomains: 'abcd',
        minZoom: 9,
	    maxZoom: 18,
	    ext: 'png'
    });

    var baseLayerForeground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
	    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	    subdomains: 'abcd',
        minZoom: 9,
	    maxZoom: 18,
        ext: 'png'
    });
    baseLayerForeground.addTo(map);

    const baseLayerCyberpunk = L.tileLayer(
        `https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}.png?access-token=${accessToken}`, {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
        maxZoom: 18,
        minZoom: 9
    });
    
    //
    // Instantiate the optional content.
    //
    const districts = new Districts(map, GEOJson_districts, highlightUpdater);
    const districtLabels = new DistrictLabels(map, GEOJson_districtLabels, highlightUpdater);
    const mesoRegion = new MesoRegion(map, GEOJson_mesoRegion.features, highlightUpdater);
    const markers = new Markers(map, undefined, highlightUpdater);

    //
    // Zoom-level-dependency
    //
    map.on('zoomend', function() {
        const currentZoomLevel = map.getZoom();
        console.log(currentZoomLevel);
    });

    //
    // Add the optional content to the map.
    //
    var bases = {
        "Toner": baseLayerBackground,
        "Dark": baseLayerDarkBackground,
        "Terrain": baseLayerTerrainBackground,
        "Cyberpunk": baseLayerCyberpunk
    }

    var overlays = {
        "Labels": baseLayerForeground,
        "Districts": districts.leafletObject,
        "District Labels": districtLabels.leafletObject,
        "Meso Region": mesoRegion.leafletObject,
        "Markers": markers.leafletObject
    }

    L.control.layers(bases, overlays).addTo(map);

}