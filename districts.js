class Districts extends Layer {

    /**
     * @param {*} map LeafletJS map object
     * @param {*} features GEOJson features
     */
    constructor(map, features, createHighlightText) {
        super(map, features, createHighlightText);
        this.featureColors = { };
        this.geoJSON = this.manualGeoJsonLoad(map);
    }

    get leafletObject() 
    { 
        return this.geoJSON;
    }    

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    createHighlighterFor(feature) {
        return (function (e) {
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
            
            const text = this.highlightTooltipText(feature.properties); //highLightControl.update(feature.properties);
            this.createHighlightText(text);
        }).bind(this)
    }

    resetHighlight(e) {
        if(this.geoJSON) {
            this.geoJSON.resetStyle(e.target);
            highLightControl.update();
        } else {
            console.warn("Could not reset highlight because the geoJSON is not accessible.");
        }
    }

    createZoomToFeatureFor(feature) {
        return function (e) {
            map.fitBounds(e.target.getBounds());
            highLightControl.update(feature.properties);
        }
    }

    onEachFeature(feature, layer) {
        layer.on({
            mouseover: this.createHighlighterFor(feature).bind(this),
            mouseout: this.resetHighlight.bind(this),
            click: this.createZoomToFeatureFor(feature)
        });
    }

    styleDistrict(feature) {
        const id = feature.properties.id
        let color = this.featureColors[id]
        if (!this.featureColors[id]) {
            color = this.getRandomColor()
        }
        this.featureColors[id] = color
        return { color: color }
    };

    manualGeoJsonLoad(map) {
        var myStyle = {
            "color": "#ff7800",
            "weight": 5,
            "opacity": 0.65
        };

        const options = {
            style: ((feature) => this.styleDistrict(feature)).bind(this) ,
            onEachFeature: ((feature, layer) => this.onEachFeature(feature, layer)).bind(this)
        }

        const geojson = L.geoJSON(GEOJson_districts.features, options);
        geojson.addTo(map);
        return geojson;
    }

    highlightTooltipText(props) {
        if (props === undefined)
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
}
