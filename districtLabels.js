class DistrictLabels extends Layer 
{
    constructor(map, features) 
    {
        super();
        this.geoJSON = L.geoJSON(features);
    }

    get leafletObject() 
    { 
        return this.geoJSON;
    }    
}