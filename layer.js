class Layer {
    constructor(createHightlightText)
    {
        this.createHightlightText = createHightlightText;
    }

    get leafletObject() 
    { 
        throw "You have to implement the `leafleftObject` getter in the extended class.";
    }

    get minZoom() 
    { 
        return 0; 
    }

    get maxZoom() 
    { 
        return 22; 
    }
}