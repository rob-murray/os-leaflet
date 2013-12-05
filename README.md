os-leaflet
==========

A Leaflet TileLayer utilising Ordnance Survey Openspace web map service

## Description

This is a new [Leafletjs](http://leafletjs.com/) TileLayer utilising Ordnance Survey Openspace web map service.

!! This service requires an API KEY - @see http://www.ordnancesurvey.co.uk/oswebsite/web-services/os-openspace/

This layer uses the OS Openspace Free service and the mapstack is defined for this service.

![ScreenShot](https://github.com/rob-murray/os-leaflet/raw/master/screenshot.png "Screenshot of demo app")

## Contents

This repository contains the following sections:

1. src - this contains the source.
2. [demo](http://rob-murray.github.io/os-leaflet/) - this contains a simple demo to show the functionality

## Getting started

Beware; this is experimental and not production ready.

### Dependencies

* [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet)
* Proj4Leaflet requires [Proj4js](http://trac.osgeo.org/proj4js/)
* [Leafletjs](http://leafletjs.com/)

### Displaying a map

The '''os-leaflet''' project extends Leaflet's `L.TileLayer.WMS` class.

See demo for specifics.

### Products

Only products with 200px tiles are working at the moment;

```
[2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2.5]
```

## Issues

Please open an issue for any problems.

Note: There are a few issues at the moment! Tiles render but the projection is not correct.

