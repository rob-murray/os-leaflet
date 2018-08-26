/**
 * os-leaflet ; A [Leafletjs](http://leafletjs.com/) TileLayer to display Ordnance Survey
 *       data in your Leaflet map via the OS OpenSpace web map service.
 *
 * https://github.com/rob-murray/os-leaflet
 */
(function (root, factory) {
  // UMD for  Node, AMD or browser globals
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['leaflet', 'proj4leaflet'], factory);
  } else if (typeof exports === 'object') {
    // Node & CommonJS-like environments.
    var L = require('leaflet'); // eslint-disable-line vars-on-top
    require('proj4leaflet');

    module.exports = factory(L);
  } else {
    // Browser globals
    if (typeof window.L === 'undefined') {
      throw new Error('Leaflet missing');
    }
    root.returnExports = factory(root.L);
  }
}(this, function (L) {
  /* This is our namespace for OSMapApi on Leaflet js */
  L.OSMapApi = L.OSMapApi || {};
  L.OSMapApi.CRS = L.extend(
    new L.Proj.CRS(
      'EPSG:27700',
      '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs', 
      {
        resolutions: [896, 448, 224, 112, 56, 28, 14, 7, 3.5, 1.75],
        bounds: L.bounds([[0, 0], [938560, 1376256]]),
        origin: [-238375.0, 0], 
        maxRows: [5, 11, 23, 47, 95, 191, 383, 767, 1535, 3071],
      }
    ), {
      distance: function (a, b) {
        return L.CRS.Earth.distance(a, b);
      }
    }
  );

  /**
   * A custom Layer for Ordnance Survey Maps API service.
   * Note: An API key is needed, see OS website for details
   *
   */
  L.OSMapApi.TileLayer = L.TileLayer.WMS.extend({

    initialize: function (apiKey, options) { // (String, Object)
      if (!apiKey) {
        throw new Error('OSMapApi layer requires an API Key parameter to function.');
      }

      options = L.extend({
        maxZoom: 9,
        minZoom: 0,
        zoomOffset: 0,
        tileSize: 256,
      }, options);

      L.TileLayer.WMS.prototype.initialize.call(this,
        'https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/wmts', 
        options);

      this.wmsParams = {
        key: apiKey,
        service: 'WMTS',
        request: 'GetTile',
        format: 'image/png',
        version: '1.0.0',
        layer: 'Leisure 27700',
        tileMatrixSet: 'EPSG:27700',
      };
    },

    getAttribution: function () {
      return '&copy; Crown copyright and database rights ' +
        new Date().getFullYear() +
        ' Ordnance Survey. ';
    },

  /**
   * Return a url for this tile.
   * The tilePoint is measured from the top left corner with negative y values.
   * The tileRow is measured from the bottom left corner with positive values.
   * The number of map tile rows between the two origins varies with zoom level.
   */
    getTileUrl: function (tilePoint) { // (Point, Number) -> String
      var OSZoom = tilePoint.z + this.options.zoomOffset
      let maxRow = this._crs.options.maxRows[OSZoom];
      this.wmsParams.tileRow = (maxRow + tilePoint.y + 1);
      this.wmsParams.tileCol = tilePoint.x;
      this.wmsParams.tileMatrix = 'EPSG:27700:' + (OSZoom);

      return this._url + L.Util.getParamString(this.wmsParams); // eslint-disable-line no-underscore-dangle
    }
  });

  /*
   * Factory method to create a new OSMapApi tilelayer.
   *
   * @public
   * @param {string} apiKey Your API key for OSMapApi.
   * @param {object} options Any options to pass to the tilelayer.
   * @return {L.TileLayer} TileLayer for Ordnance Survey Maps API service.
   */
  L.OSMapApi.tilelayer = function (apiKey, options) {
    return new L.OSMapApi.TileLayer(apiKey, options);
  };

  return L.OSMapApi;
}));