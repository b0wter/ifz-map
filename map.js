const accessToken = 'QGL5193opsh2qwJCN6b4txetJA13AW1d3ZZ6nhezliTIDuvijFgpXsAHxsXsN8lt';
let map;
let geojson;
let highLightControl;

function onMarkerClick(e) {
    var popup = e.target.getPopup();
    var content = popup.getContent();
    console.log(content);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createHighlighterFor(feature) {
    return function (e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#F00',
            dashArray: '',
            fillOpacity: 0.3
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        highLightControl.update(feature.properties);
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    highLightControl.update();
}

function createZoomToFeatureFor(feature) {
    return function(e) {
        console.log("zoom", feature)
        map.fitBounds(e.target.getBounds());
        highLightControl.update(feature.properties);
    }
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: createHighlighterFor(feature),
        mouseout: resetHighlight,
        click: createZoomToFeatureFor(feature)
    });
}

const featureColors = {}
function styleDistrict(feature) {
    const id = feature.properties.id
    let color = featureColors[id]
    if (!featureColors[id]) {
        color = getRandomColor()
    }
    featureColors[id] = color
    return { color: color }
};

function manualGeoJsonLoad(map) {
    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };

    const options = {
        style: function (feature) {
            return styleDistrict(feature);
        },
        onEachFeature: function (feature, layer) { onEachFeature(feature, layer) }
    }

    geojson = L.geoJSON(districts.features, options);
    geojson.addTo(map);
}

function highlightTooltipText(props)
{
    if(props === undefined)
        return "<h2>No selection</h2>";
    const totalPopulation = (props.pop_2010 * 2 / 10000).toFixed(1);
    const populationDensity = (props.pop_density_2010 * 2 / 10000).toFixed(1);
    const area = props.area;
    const wealth = (props.budget_2015 / 1000000).toFixed(0);
    const wealthPerPerson = ((props.budget_2015) / (props.pop_2010 * 2)).toFixed(2);
    return `
        <h2>${props.name}</h2>
        <p>
        Total population: ${totalPopulation} K<br>
        Population density: ${populationDensity} K/km²<br>
        Area: ${area} km²<br>
        Wealth: ${wealth} Mio. R$<br>
        Wealth p.P: ${wealthPerPerson} R$/p.P.<br>
        </p>

    `;
}

function initialize() {
    map = L.map('map').setView([-23.543773, -46.625290], 13);
    const baseLayer = L.tileLayer(
        `https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}.png?access-token=${accessToken}`, {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
        maxZoom: 18
    });
    baseLayer.addTo(map);
    L.control.scale().addTo(map);

    // Morals & Nature HQ
    const mAndNMarker = L.marker([-23.543773, -46.625290], { icon: violetIcon, title: "Morals & Nature" })
    mAndNMarker.bindPopup("Morals & Nature");

    const markers = [mAndNMarker];
    markers.forEach(element => {
        element.on('click', onMarkerClick);
    });

    const markerLayer = L.layerGroup(markers);

    //loadGeoJson(map);
    manualGeoJsonLoad(map);

    var bases = {
        "Base": baseLayer
    }

    var overlays = {
        "Districts": geojson,
        "Markers": markerLayer
    }

    L.control.layers(bases, overlays).addTo(map);

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
}