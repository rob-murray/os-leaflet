
/**
 * os-leaflet ; A [Leafletjs](http://leafletjs.com/) TileLayer to display Ordnance Survey 
 *       data in your Leaflet map via the OS OpenSpace web map service.
 *
 * https://github.com/rob-murray/os-leaflet
 */
L.OSOpenSpace = L.Class.extend({

    /**
     * Define some static fields; help out developers & encapsulate
     *  boilerplate code.
     */
    statics: {

        /**
         * The tile resolutions available here.
         *  In metres per pixel.
         * {Array}
         */
        RESOLUTIONS: [2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2.5],

        /**
         * The OSGB36 datum Proj4 def & auxiliary data.
         *
         * proj => minx, miny -> 1393.0196, 13494.9764  
         *   max-x, max-y -> 671196.3657, 1230275.0454
         *   xmin-7.5600, ymin49.9600, xmax1.7800, ymax60.8400
         *   0,0,700000,1300000
         * {Object}
         */
        _OSGB36: {
            EPSG:  'EPSG:27700',
            DEF: '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000' + 
            '+ellps=airy +datum=OSGB36 +units=m +no_defs',
            EXTENT: [1393.0196, 13494.9764, 671196.3657, 1230275.0454],
            PROJ_EXTENT: [0, 0, 700000, 1300000]
        },

        /**
         * Return a {L.Proj.CRS} configured to EPSG:27700 for the OpenSpace Tile layer.
         * {L.Proj.CRS}
         */
        getCRS: function(){

            if (typeof window.L === 'undefined' || typeof window.proj4 === 'undefined') {
                throw 'Leaflet & Proj4js libraries must be included before OSOpenSpace layer';
            }

            var klass = L.OSOpenSpace;
            var osgb36crs = new L.Proj.CRS( klass._OSGB36.EPSG, klass._OSGB36.DEF,
              {
                resolutions: klass.RESOLUTIONS,
                //origin: [0, 0],
                bounds: L.bounds([klass._OSGB36.PROJ_EXTENT[3], klass._OSGB36.PROJ_EXTENT[0]], [klass._OSGB36.PROJ_EXTENT[2], klass._OSGB36.PROJ_EXTENT[1]])
                }
            );
            return osgb36crs;
        }
            
    }    


});

/**
 * A custom Layer for Ordnance Survey OpenSpace service.
 *  Note: An API key is needed, see OS website for details
 *
 */
L.TileLayer.OSOpenSpace = L.TileLayer.WMS.extend({

    /**
     * Standard WMS params, specific for OpenSpace service.
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
     * The tile resolutions available here; populated at runtime
     * In metres per pixel
     */
    resolutions: [],
    
    /**
     * The URL of the OS OpenSpace (Free) tile server
     */
    _url: "http://openspace.ordnancesurvey.co.uk/osmapapi/ts",

    /**
     * The spec for the OS products available here in the format
     * ProductName: [resolution (mpp), tile size (pixels)]
     * Not used at present, for info.
     * 
     * For more details see http://www.ordnancesurvey.co.uk/business-and-government/help-and-support/web-services/os-ondemand/configuring-wmts.html
     *
     
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
    },*/

    /**
     * Set whether to output some logging.
     * Set true to turn on, false otherwise
     */
    debug: false,


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
               
        this.options.tileSize = 200;
        this.resolutions = L.OSOpenSpace.RESOLUTIONS;
        this.defaultLayerOptions.maxZoom = L.OSOpenSpace.RESOLUTIONS.length - 1; 

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
        var tileBboxY0 = tileSizeMetres * tilePoint.y;

        if (this.debug) console.log(">>tileSizePixels: "+tileSizePixels+", zoom: "+zoom+", resolutionMpp: "+resolutionMpp+", tileSizeMetres: "+tileSizeMetres);

        /* service is a tile based wms format and only requires x0,y0 */
        var bbox = [tileBboxX0, tileBboxY0, 0, 0].join(',');

        var url = L.Util.template(this._url, {});

        if (this.debug) console.log(">>Bbox: ",bbox);

        return url + L.Util.getParamString(this.wmsParams) + "&BBOX=" + bbox + '&WIDTH=' + tileSizePixels + '&HEIGHT=' +tileSizePixels + '&LAYERS='+resolutionMpp;
    
    }

});

/* factory */
L.tileLayer.osopenspace = function (apiKey, options) {
    return new L.TileLayer.OSOpenSpace(apiKey, options);
};
