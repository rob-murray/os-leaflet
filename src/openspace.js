
/**
 * A custom Layer for Ordnance Survey OpenSpace service.
 *
 * Note: An API key is needed, see OS website for details
 */
L.TileLayer.OSOpenSpace = L.TileLayer.WMS.extend({

    /**
     * Standard WMS params, specific for OpenSpace service
     */
    defaultWmsParams: {
        SERVICE: 'WMS',
        REQUEST: 'GetMap',
        VERSION: '1.1.1',
        FORMAT: 'image/png'
    },

    /**
     * Options specifically required by this layer.
     * These can be overridden but things may not work
     */
    defaultLayerOptions: {
        maxZoom: null,
        minZoom: 0,
        continuousWorld: true,
        worldCopyJump: false,
        tms: true,
        attribution: " OS.OpenSpace",
    },

    /**
     * The tile resolutions available here
     * In metres per pixel
     */
    resolutions: [2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2.5],
    
    /**
     * The URL of the OS OpenSpace (Free) tile server
     */
    _url: "http://openspace.ordnancesurvey.co.uk/osmapapi/ts",

    /**
     * The spec for the OS products available here in the format
     * ProductName: [resolution (mpp), tile size (pixels)]
     */
    tileResolutions: {
        "VMD": [2.5, 200],
        "50K": [5.0, 200],
        "50KR": [10.0, 200],
        "250K": [25.0, 200],
        "250KR": [50.0, 200],
        "MS": [100.0, 200],
        "MSR": [200.0, 200],
        "OV2": [500.0, 200],
        "OV1": [1000.0, 200],
        "OV0": [2500.0, 200]
    },

    /**
     * Set whether to output some logging.
     * Set true to turn on, false otherwise
     */
    debug: true,


    /**
     * Create new instance of `L.TileLayer.OSOpenSpace`
     * Inject custom properties into request params
     *
     * @override
     */
    initialize: function (apiKey, options) { // (String, Object)

        var authParams = {
            "KEY": apiKey,
            "URL": "file:///"
        };

        this.defaultLayerOptions.maxZoom = this.resolutions.length - 1;        

        this.options.tileSize = 200;

        var wmsParams = L.extend(authParams, this.defaultWmsParams),
            tileSize = options.tileSize || this.options.tileSize;

        wmsParams.width = wmsParams.height = 200;

        for (var i in options) {
            // all keys that are not TileLayer options go to WMS params
            if (!this.options.hasOwnProperty(i) && i !== 'crs') {
                wmsParams[i] = options[i];
            }
        }

        this.wmsParams = wmsParams;

        L.setOptions(this, this.defaultLayerOptions);
    },    

    /**
     * Return a url for this tile.
     * Calculate the bbox for the tilePoint and format the wms request
     *
     * @override
     */
    getTileUrl: function (tilePoint) { // (Point, Number) -> String

        if (this.debug) console.log('>>tilePoint: ',tilePoint.toString());

        var map = this._map,
            tileSizePixels = this.options.tileSize,
            crs = map.options.crs,
            zoom = tilePoint.z,
            resolutionMpp = this.resolutions[zoom],
            tileSizeMetres = tileSizePixels * resolutionMpp;

        /* tilePoint appears to be topLeft in this config */
        var tileBboxX0 = tileSizeMetres * tilePoint.x;   
        var tileBboxY0 = (tileSizeMetres * tilePoint.y) - tileSizeMetres;

        if (this.debug) console.log(">>tileSizePixels: "+tileSizePixels+", zoom: "+zoom+", resolutionMpp: "+resolutionMpp+", tileSizeMetres: "+tileSizeMetres);

        /* service is a tile based wms format and only requires x0,y0 */
        var bbox = [tileBboxX0, tileBboxY0, 0, 0].join(',');

        var url = L.Util.template(this._url, {});

        if (this.debug) console.log(">>Bbox: ",bbox);

        return url + L.Util.getParamString(this.wmsParams) + "&BBOX=" + bbox + '&WIDTH=' + tileSizePixels + '&HEIGHT=' +tileSizePixels + '&LAYERS='+resolutionMpp;
    
    }

});

L.tileLayer.osopenspace = function (apiKey, options) {
    return new L.TileLayer.OSOpenSpace(apiKey, options);
};
