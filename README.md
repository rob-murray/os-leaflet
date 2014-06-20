os-leaflet
==========

[![Haz Commitz Status](http://haz-commitz.herokuapp.com/repos/rob-murray/os-leaflet.svg)](http://haz-commitz.herokuapp.com/repos/rob-murray/os-leaflet)

A [Leafletjs](http://leafletjs.com/) TileLayer to display Ordnance Survey map data in your Leaflet map via the OS OpenSpace web map service.

**Important:** This project is no way affiliated, nor supported or endorsed by Ordnance Survey. The use of this project does not comply with the Ordnance Survey OpenSpace service [terms and conditions](http://www.ordnancesurvey.co.uk/business-and-government/licensing/licences/os-openspace-developer-agreement.html).
 

## Description

The **os-leaflet** project is a new `L.TileLayer` that can be used to easily get Ordnance Survey products into a Leaflet map.

**Note:** This layer uses an Ordnance Survey service that requires an API KEY - see http://www.ordnancesurvey.co.uk/oswebsite/web-services/os-openspace/

![ScreenShot](https://github.com/rob-murray/os-leaflet/raw/master/screenshot.png "Screenshot of demo app")


## Contents

This repository contains the following sections:

1. `src/osopenspace.js` - This contains the source code to the `L.TileLayer.OSOpenSpace` layer.
2. [Demo](http://rob-murray.github.io/os-leaflet/) - A simple demo to show off the functionality.


## Getting started

!Beware; this is experimental and not production ready.


### Dependencies

Download these dependencies and import into your project so that this OS OpenSpace layer can work.

* [Leafletjs](http://leafletjs.com/)
* Proj4Leaflet requires [Proj4js](http://trac.osgeo.org/proj4js/)
* [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet)

**Note:** The order of import should be as above; Leaflet, Proj4js, Proj4Leaflet and then OS OpenSpace layer - see the demo for an example.

### Register for an API key

Ordnance Survey require an API key for use with their tile service, head over to [OS OpenSpace](http://www.ordnancesurvey.co.uk/oswebsite/web-services/os-openspace/) to register before using on own website.

This layer uses the OS Openspace Free service and with the mapstack or products configured for the best experience available with the Free service.

**Note:** This will work locally without an API key; both `localhost` and `file:///` hostname and protocol override the need for a key.


### Displaying a map

The *os-leaflet* project extends Leaflet's `L.TileLayer.WMS` class and integrates easily with Leaflet.

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

Finally, create a new `L.TileLayer.OSOpenSpace` and add to the map instance as normal. `L.TileLayer.OSOpenSpace` takes two params, `(apiKey, options)` as `(String, Object)` - the `apiKey` should be the Ordnance Survey [OpenSpace](http://www.ordnancesurvey.co.uk/oswebsite/web-services/os-openspace/) API key for the website domain name to be used. 


```javascript
var openspaceLayer = L.tileLayer.osopenspace("<API Key>", {}); 

map.addLayer(openspaceLayer);
```

Don't forget to set the map centre to somewhere in Great Britain too.

See [our demo](http://rob-murray.github.io/os-leaflet/) for an example of using the layer.


### Products

This layer is currently hard-coded to work with only Ordnance Survey products with 200px tiles are working at the moment, the resolutions available are below.

```
[2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2.5] 
// OV0, OV1, OV2, MSR, MS, 250KR, 250K, 50KR, 50K, VMD
```

For the full spec, see [OS website](http://www.ordnancesurvey.co.uk/business-and-government/help-and-support/web-services/os-ondemand/configuring-wmts.html)


## Issues

Please open an issue for any problems.


