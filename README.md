os-leaflet
==========

[![npm version](https://badge.fury.io/js/os-leaflet.svg)](http://badge.fury.io/js/os-leaflet)

A [Leafletjs](http://leafletjs.com/) TileLayer to display Ordnance Survey map data in your Leaflet map via the OS OpenSpace web map service.

**Important:** This project is no way affiliated, nor supported or endorsed by Ordnance Survey. The use of this project does not comply with the Ordnance Survey OpenSpace service [terms and conditions](http://www.ordnancesurvey.co.uk/business-and-government/licensing/licences/os-openspace-developer-agreement.html). Use at your peril!


## Description

The **os-leaflet** project is a new `L.TileLayer` that can be used to easily get Ordnance Survey products into a Leaflet map, the Leaflet API can be used as normal.

**Note:** This layer uses an Ordnance Survey service that requires an API KEY - attempt to get one [here](http://www.ordnancesurvey.co.uk/business-and-government/products/os-openspace/api/index.html).

![ScreenShot](https://github.com/rob-murray/os-leaflet/raw/master/screenshot.png "Screenshot of demo app")

## Versions

Version 1.x supports [Leaflet 1.0](http://leafletjs.com/2016/09/27/leaflet-1.0-final.html), we depend on other Leaflet 1.0 compatible libraries too.

If you are using Leaflet version < 1.0 then please use [v0.2.1](https://github.com/rob-murray/os-leaflet/releases/tag/v0.2.1) of this library, or the [0.2-stable branch](https://github.com/rob-murray/os-leaflet/tree/0.2-stable).


## Contents

This repository contains the following sections:

1. `OSOpenSpace.js` - This contains the source code to the `L.OSOpenSpace` tilelayer.
2. [Demo](http://rob-murray.github.io/os-leaflet/) - A simple demo to show off the functionality.


## Getting started

You can get hold of the code with npm and it should work fine with [browserify](http://browserify.org/). Or you can just manually import the layer.

### Dependency management

With npm:

```
$ npm install os-leaflet --save
```

Bundle for the browser with whichever tool you're using, eg [webpack](https://webpack.github.io/), [browserify](http://browserify.org/).

Then just require the libary along with Leaflet in your app.

```javascript
require('os-leaflet');
layer = L.OSOpenSpace.tilelayer(apiKey, ...options);
```

### Manually

Download these dependencies and import into your project so that this OS OpenSpace layer can work.

* [Leafletjs](http://leafletjs.com/)
* Proj4Leaflet requires [Proj4js](http://trac.osgeo.org/proj4js/)
* [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet)

**Note:** The order of import should be as above; Leaflet, Proj4js, Proj4Leaflet and then OS OpenSpace layer - see the demo for an example.


### Register for an API key

Ordnance Survey require an API key for use with their tile service, head over to [OS OpenSpace](http://www.ordnancesurvey.co.uk/business-and-government/products/os-openspace/api/index.html) to register before using on own website.

This layer uses the OS Openspace Free service and with the mapstack or products configured for the best experience available with the Free service.

**Note:** This will work locally an key; both `localhost` and `file:///` hostname and protocol override the hostname check.


### Displaying a map

The **os-leaflet** project extends Leaflet's `L.TileLayer.WMS` class and integrates easily with Leaflet.

To use the Layer in your map just get the `L.Proj.CRS` - Coordinate Reference System, how the earth is represented in this part of the world - via a factory method.


```javascript
var osgbCrs = L.OSOpenSpace.CRS;
```

Create a `L.Map` as normal but specify the `L.Proj.CRS` created above and set Leaflet options `continuousWorld` to `true` and `worldCopyJump` to `false`. The zoom levels available are essentially the layers provided by this `OSOpenSpace` layer so set these as below.

```javascript
var map = new L.Map('map', {
  zoom: 6,
  crs: L.OSOpenSpace.CRS,
});
```

Finally, create a new `L.TileLayer` via the factory method `L.OSOpenSpace.tilelayer` and add to the map instance as normal. `L.OSOpenSpace.tilelayer` takes two params, `(apiKey, options)` as `(String, Object)` - the `apiKey` should be the Ordnance Survey [OpenSpace](http://www.ordnancesurvey.co.uk/business-and-government/products/os-openspace/api/index.html) API key for the website domain name to be used.


```javascript
var openspaceLayer = L.OSOpenSpace.tilelayer("<API Key>", {});
map.addLayer(openspaceLayer);
```

Don't forget to set the map centre to somewhere in Great Britain too.

See [our demo](http://rob-murray.github.io/os-leaflet/) for an example of using the layer.


### Map products

This layer is currently hard-coded to work with only Ordnance Survey products that have 200x200 pixel tiles at the moment, the resolutions available are below. Other products have varying tile sizes which don't play well with Leaflet, it prefers a power-of-2 stack.

```
// OV0, OV1, OV2, MSR, MS, 250KR, 250K, 50KR, 50K, VMD
[2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2.5]
```

For the full spec, see [OS website](http://www.ordnancesurvey.co.uk/business-and-government/help-and-support/web-services/os-ondemand/configuring-wmts.html).


## Issues

Please open an issue for any problems.


## Contributions

Please use the GitHub pull-request mechanism to submit contributions.


## License

This project is available for use under the MIT software license. See LICENSE
