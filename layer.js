class Layer {
    constructor(map, features, createHighlightText)
    {
        this.map = map;
        this.features = features;
        this.createHighlightText = createHighlightText;
    }

    get leafletObject() 
    { 
        throw "You have to implement the `leafleftObject` getter in the extended class.";
    }
}