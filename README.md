os-leaflet
==========

A [Leafletjs](http://leafletjs.com/) TileLayer to display Ordnance Survey map data in your Leaflet map via the OS OpenSpace web map service.
 

## Description

This is a new `L.TileLayer` that can be used to easily get Ordnance Survey products into a Leaflet map.

!! This service requires an API KEY - @see http://www.ordnancesurvey.co.uk/oswebsite/web-services/os-openspace/

This layer uses the OS Openspace Free service and the mapstack is defined for this service.

![ScreenShot](https://github.com/rob-murray/os-leaflet/raw/master/screenshot.png "Screenshot of demo app")


## Contents

This repository contains the following sections:

1. `src` - This contains the source code to the `L.TileLayer.OSOpenSpace`.
2. [demo](http://rob-murray.github.io/os-leaflet/) - A simple demo to show off the functionality.


## Getting started

!Beware; this is experimental and not production ready.


### Dependencies

* [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet)
* Proj4Leaflet requires [Proj4js](http://trac.osgeo.org/proj4js/)
* [Leafletjs](http://leafletjs.com/)


### Register for an API key

Ordnance Survey require an API key for use with their tile service, head over to [OS OpenSpace](http://www.ordnancesurvey.co.uk/oswebsite/web-services/os-openspace/) to register before starting.


### Displaying a map

The '''os-leaflet''' project extends Leaflet's `L.TileLayer.WMS` class and integrates easily with Leaflet.

To use the Layer in your map just get the `L.Proj.CRS` - Coordinate Reference System, how the earth is represented in this part of the world - via a factory method.


```javascript

var osgbCrs = L.OSOpenSpace.getCRS();

```

Create a `L.Map` as normal but specify the `L.Proj.CRS` created above and set Leaflet options `continuousWorld` to `true` and `worldCopyJump` to `false`. The zoom levels available are essentially the layers provided by this `OSOpenSpace` layer so set these as below.

```javascript
var map = new L.Map('map', {
    crs: osgbCrs,
    continuousWorld: true,
    worldCopyJump: false,
    minZoom: 0,
    maxZoom: L.OSOpenSpace.RESOLUTIONS.length - 1,
});
```

Finally, create a new `L.TileLayer.OSOpenSpace` and add to the map instance as normal. `L.TileLayer.OSOpenSpace` takes two params, `(apiKey, options)` as `(String, Object)`.


```javascript
var openspaceLayer = L.tileLayer.osopenspace("<API Key>", {}); 

map.addLayer(openspaceLayer);
```

Don't forget to set the map centre to somewhere in Great Britain too,

See [our demo](http://rob-murray.github.io/os-leaflet/) for more details.


### Products

This layer is hard-coded to work with only Ordnance Survey products with 200px tiles are working at the moment, the resolutions available are below.

```
[2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2.5] 
// OV0, OV1, OV2, MSR, MS, 250KR, 250K, 50KR, 50K, VMD
```

For the full spec, see [OS website](http://www.ordnancesurvey.co.uk/business-and-government/help-and-support/web-services/os-ondemand/configuring-wmts.html)


## Issues

Please open an issue for any problems.

Note: There are a few issues at the moment! Tiles render but the projection is not correct.

