class MesoRegion extends Layer 
{    
    constructor(map, features, createHighlightText) 
    {
        super(map, features, createHighlightText);
        this.geoJSON = L.geoJSON(features);
    }

    get leafletObject() 
    { 
        return this.geoJSON;
    }        
}