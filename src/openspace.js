L.TileLayer.OS = L.TileLayer.WMS.extend({

    defaultWmsParams: {
        SERVICE: 'WMS',
        REQUEST: 'GetMap',
        VERSION: '1.1.1',
        FORMAT: 'image/png'
    },
        
    defOptions: {
        maxZoom: 13,
        minZoom: 1,
        continuousWorld: true,
        tms: true,
        attribution: " && OS.Openspace"
        },
    resolutions: [2500, 1000, 500, 200, 100, 50, 25, 10, 5, 4, 2.5, 2, 1],
    _url: "http://openspace.ordnancesurvey.co.uk/osmapapi/ts",

	initialize: function (apiKey, options) { // (String, Object)
	
	    this.options.tileSize = options.tileSize;//this should be calculated from the zoom but not in the init fn

		var wmsParams = L.Util.extend({}, this.defaultWmsParams);

                //Create obj for the API key
                var newparams = {
                    "KEY": apiKey
                };
                
                wmsParams = L.Util.extend(wmsParams, newparams);

                //TODO: escape chars- why doesnt leaflet do it?!
		for (var i in options) {
			// all keys that are not TileLayer options go to WMS params
			if (!this.options.hasOwnProperty(i)) {
				wmsParams[i] = options[i];
			}
		}

		this.wmsParams = wmsParams;

		L.Util.setOptions(this, this.defOptions);
	},
	
	
	//TODO: doc
	setOsTileSize: function (sizeInt){
	    console.log('>> setting tilesize: ',sizeInt);
	    this.options.tileSize = sizeInt;
	},
	//TODO: doc
	getCurrentLayerTileSize: function(){
        var zoom = this._map.getZoom();
        var res = resolutions[z-1];
        var tileSize = (res < 5 && res !== 2.5) ?  250 : 200;
        return tileSize;
	},


	getTileUrl: function (tilePoint) { // (Point) -> String
            
        console.log('>> tilePoint: ',tilePoint.toString());

		var map = this._map;
        var crs = map.options.crs;
                
                
        var zoom = map.getZoom();
        console.log('>> zoom: ',zoom);

        var res = this.resolutions[zoom-1];
        console.log('>> res: ',res);
                
        var tileSize = this.options.tileSize;
        //this.options.tileSize = map.options.tileSize;//this needs to be set after a zoom event


        var nwPoint = tilePoint.multiplyBy(tileSize);
        var sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
                
                
console.log(">> tileSize: ",tileSize);            
                
console.log(">> NW_Point: ",nwPoint.toString());
console.log(">> SE_Point: ",sePoint.toString());

		var nw = crs.project( map.unproject(nwPoint, zoom) );
		var se = crs.project( map.unproject(sePoint, zoom) );
                
console.log(">> nw: ",map.unproject(nwPoint, zoom, true).toString());
console.log(">> NW: ",nw.toString());

		var bbox = [nw.x, se.y, se.x, nw.y].join(',');
        console.log(">> bbox: ",bbox);


		var url = L.Util.template(this._url, {});//TODO find out what this specifically does

		return url + L.Util.getParamString(this.wmsParams) + "&BBOX=" + bbox + '&WIDTH=' + tileSize + '&HEIGHT=' +tileSize + '&LAYERS='+res;
	}


});

L.tileLayer.os = function (url, options) {
	return new L.TileLayer.OS(url, options);
};
