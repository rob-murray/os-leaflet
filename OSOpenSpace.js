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
  /* This is our namespace for OSOpenSpace on Leaflet js */
  L.OSOpenSpace = L.OSOpenSpace || {};
  L.OSOpenSpace.CRS = L.extend(
    new L.Proj.CRS(
      'EPSG:27700',
      '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs', {
        resolutions: [2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2.5]
      }
    ), {
      distance: function (a, b) {
        return L.CRS.Earth.distance(a, b);
      }
    }
  );

  L.OSOpenSpace.LogoControl = L.Control.extend({
    options: {
      position: 'bottomleft'
    },

    onAdd: function () {
      var container = L.DomUtil.create('div', 'os-logo-control');
      var logoImage = L.DomUtil.create('img', '', container);
      logoImage.title = 'Powered by OS OpenSpace';
      logoImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAA7CAMAAAD4p6zTAAAAdVBMVEUAAABDPYxDPY1AQI9EPY5EPoxEPY3///9EPY3z8/iWkr+KhrhzbqrEB1FnYaJbVZtQSZR+erGinsb00d7Fwtv78PTwwdTQz+PTRX3IF1zc2+ro5/Gtqs25ttTig6jaZJLtssn44OnLJmfpor7lk7PPNnLWVYfBOrQkAAAAB3RSTlMAUJ8Qv8+vnqzJJAAAAmNJREFUeAHl14Vi2zAUheHyuVds5nD6/o84211YcsHj/aVA85lBd0P3T/S1nu7vxh5fiIyIP58wRA+PA/FApsHXagw9DEtBhvHV2FC/LM/U4Os19Hx3RwZzMtQTAnMSAxFjTvE5QaRkg4lUARRqkgDLaC6BVHWOhBToeo9qS4adU4JIsCJrB8I5Em0EmM5HxMIJV7ORFhGlXWRaRDHVtWN2MkJNI9GwjYlrBx9RFE2sgFjZwrUy6kgpJQit6/+6DjDfFySOZStFYEFQWEbUCisb59imYKbxtVrKw1wwVFtY14QISGcN15TCSHSkXEdAZI1t+h83EtYaholwSxxqahzj4uy1gk9P2BYe4jOxFZhJ9P0vRN1K1RenjIvWu2WJbblIME1wa+mYbM6Ape7DbqP1ZjtFpJYuEoc5WVV6aLB6pcyChKDrTP0m6LcwttBVEiAk3eYGY11dEMir0k9I8uUYWOpLAknuJVLypwB9aHqjsqNAHZYfI2IKZbH+GGEpWIrXA5HkSZCoKZzE7kCUWleLzE/EFM4hPyN6ZOslJE3EOCf6tj5C0UTFNaFX84kqm03oxS0R0USM/TWx+ewWQVZeETq7IQoKF6Fvu78k8hsCjoJ1GFvnizAxvSSOceiMSD5zpMbwEbgl0JI/Ax/x6iFC29XVWCW3RO4l2JCnAiir/JoInDvBkf/sm1R6cUlUWYAAWkcXqQZD673ebLMTsUmmblGkOwMKHNpV/cwvF9lILLPpayqnQlkiFbUNzlst91onZVXu1n/mzcH8kcD88cj8UdGPGJvNHyH2PT7MHKfOHy1/Axgmj2KBwwXnAAAAAElFTkSuQmCC';

      return container;
    }
  });

  /**
   * A custom Layer for Ordnance Survey OpenSpace service.
   * Note: An API key is needed, see OS website for details
   *
   */
  L.OSOpenSpace.TileLayer = L.TileLayer.WMS.extend({

    options: {
      termsURL: false
    },

    initialize: function (apiKey, apiUrl, options) { // (String, String, Object)
      if (!apiKey) {
        throw new Error('OSOpenSpace layer requires an API Key parameter to function.');
      }
      apiUrl = (typeof apiUrl === 'undefined' || apiUrl === null) ? 'file:///' : apiUrl;

      options = L.Util.extend({
          crs: L.OSOpenSpace.CRS,
          maxZoom: 14,
          minZoom: 0,
          tileSize: 200
        }, options);

      L.TileLayer.WMS.prototype.initialize.call(this,
        'https://openspace.ordnancesurvey.co.uk/osmapapi/ts', 
        options
      );

      this.wmsParams = {
        KEY: apiKey,
        FORMAT: 'image/png',
        URL: apiUrl,
        REQUEST: 'GetMap',
        WIDTH: this.options.tileSize,
        HEIGHT: this.options.tileSize
      };
    },

    getAttribution: function () {
      var href = 'href="#" ';
      if (this.options.termsURL !== false) {
        href = 'href="' + this.options.termsURL + '" target="_blank" ';
      }
      return '&copy; Crown copyright and database rights ' +
        new Date().getFullYear() +
        ' Ordnance Survey. ' +
        '<a class="os-leaflet-terms-link" ' +
        href +
        'title="OS OpenSpace Terms of Use">' +
        'Terms of Use</a>.';
    },

    onAdd: function (map) {
      if (map.options.attributionControl) {
        map.addControl(new L.OSOpenSpace.LogoControl());
      }

      if (this.options.termsURL === false) {
        // If no URL has been provided for the terms-of-use link then use default pop-up licence.
        // Adds a click handler to a Terms of Use link.
        // This has be done when adding of layer has finished.
        L.OSOpenSpace.addTerms(map);
        map.on('layeradd', function(e) {
          if (e.layer == this) {         
            L.OSOpenSpace._termsClickHandler(map);
          }
        }, this);
      }

      // Call parent function to get default behaviour.
      L.TileLayer.prototype.onAdd.call(this, map);
    },

  /**
   * Return a url for this tile.
   * Calculate the bbox for the tilePoint and format the wms request
   */
    getTileUrl: function (tilePoint) { // (Point, Number) -> String
      var resolutionMpp = this.options.crs.options.resolutions[tilePoint.z],
        tileSizeMetres = this.options.tileSize * resolutionMpp,
        tileBboxX0 = tileSizeMetres * tilePoint.x,
        tileBboxY0 = tileSizeMetres * (-1 - tilePoint.y); // TODO: Is there a missing transformation ? tilePoint appears to be topLeft in this config

      // service is a tile based wms format and only requires x0, y0 - ignore other points
      this.wmsParams.BBOX = [tileBboxX0, tileBboxY0, 0, 0].join(',');
      this.wmsParams.LAYERS = resolutionMpp;

      return this._url + L.Util.getParamString(this.wmsParams); // eslint-disable-line no-underscore-dangle
    }
  });

  /**
   * Add a div to contain OS terms and conditions.
   */
  L.OSOpenSpace.addTerms = function(map) {
    var mapDiv = map.getContainer();
    var termsContainerDiv = L.DomUtil.create('div', 'os-leaflet-terms-container', mapDiv);
    var termsClose = L.DomUtil.create('a', 'os-leaflet-terms-close-button', termsContainerDiv);
    var termsDiv = L.DomUtil.create('div', 'os-leaflet-terms', termsContainerDiv);
    termsClose.innerHTML = 'x';
    termsClose.setAttribute('href', "#");
    termsClose.setAttribute('title', "Close");
    termsDiv.innerHTML = L.OSOpenSpace.terms;

    termsClose.addEventListener('click', function(e) {
      termsContainerDiv.style.display = "none";
      e.stopPropagation();
      L.OSOpenSpace.mapEnable(map);
    });
  };

  /**
   * Add a click handler to the Terms and Conditions link to pop up the terms.
   */
  L.OSOpenSpace._termsClickHandler = function(map) {
    var mapDiv = map.getContainer();
    var termLink = mapDiv.getElementsByClassName("os-leaflet-terms-link")[0];
    var termsContainerDiv = mapDiv.getElementsByClassName("os-leaflet-terms-container")[0];
    var termsDiv = mapDiv.getElementsByClassName("os-leaflet-terms")[0];
    termLink.addEventListener('click', function(e) {
      var size = map.getSize();
      // 16px margin on container div and 19px + 11px margin on inner div = 62
      termsDiv.style.height = (size.y - 62) + 'px';
      termsContainerDiv.style.display = "block";
      L.OSOpenSpace.mapDisable(map);
    });
  };

  /**
   * Disable standard map interactions.
   */
  L.OSOpenSpace.mapDisable = function(map) {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
    map.getContainer().style.cursor='default';
  };

  /**
   * Enable standard map interactions.
   */
  L.OSOpenSpace.mapEnable = function(map) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    if (map.tap) map.tap.enable();
    map.getContainer().style.cursor='grab';
  };

  /*
   * Factory method to create a new OSOpenSpace tilelayer.
   *
   * @public
   * @param {string} apiKey Your API key for OSOpenSpace.
   * @param {string} apiUrl The URL of your site as provided to OSOpenSpace.
   * @param {object} options Any options to pass to the tilelayer.
   * @return {L.TileLayer} TileLayer for Ordnance Survey OpenSpace service.
   */
  L.OSOpenSpace.tilelayer = function (apiKey, apiUrl, options) {
    return new L.OSOpenSpace.TileLayer(apiKey, apiUrl, options);
  };


  /**
   * End User Terms of Use copied from Schedule 2 of the OS OpendSpace Developer Agreement. 13th March 2017.
   * https://www.ordnancesurvey.co.uk/business-and-government/licensing/licences/os-openspace-developer-agreement.html
   */
  L.OSOpenSpace.terms = " \
    <h3>End User Terms of Use (Terms of Use)</h3> \
    \
    <p><strong>Your use of the Application is governed by this agreement between ‘you’ and the Developer (the ‘End User Terms of Use (Terms of Use)’) Please read these Terms of Use and ensure that you have understood them. If you do not agree to these Terms of Use, please immediately stop using the Application, including the Ordnance&nbsp;Survey Data.</strong></p> \
    \
    <h4>Background</h4> \
    \
    <p>A The Developer has created an Application using the OpenSpace API and/or an OpenSpace SDK. The Application consists of, and allows you to access and use, a feed of Ordnance&nbsp;Survey mapping data via the use of a unique API key embedded in the Application.</p> \
    <p>B These Terms of Use govern your use of the Ordnance&nbsp;Survey Data and related services provided by Ordnance&nbsp;Survey through the delivery of the Application. These Terms of Use do not cover the Application itself or any content/data of the Developer or third parties, which shall be governed by the Developer’s own terms.</p> \
    \
    <h4>1 Definitions</h4> \
    \
    <p>‘Application’ means an application(s) developed by the Developer using the OpenSpace API which is designed to access and use the Ordnance&nbsp;Survey Data via the internet which must be publicly accessible on the internet and must not be restricted, in whole or part, by firewall or otherwise, nor operate only on an internal network;</p> \
    <p>‘Caching’ means the automatic, immediate download and temporary storage of data, where such download and storage is an integral and essential part of a technological process, such storage to be no longer than 24 hours;</p> \
    <p>‘Data’ means any text, graphics, audio, visual (including still visual images) and/or audio visual material, software, applications, data, database content or other multimedia content, information and material;</p> \
    <p>‘Derived Data’ means any and all Data that is created by you through your use of the Application(s) which substantially reproduces and/or which is adapted, extracted, reutilized or derived directly or indirectly from Ordnance&nbsp;Survey Data. By way of example, but without limitation, Derived Data would include any Data created by you identifying the location or other attribute of any new feature directly using Ordnance&nbsp;Survey Data or a feature already present in Ordnance&nbsp;Survey Data and shall include Waypoints and User Generated Routes;</p> \
    <p>‘Developer’ means the person or entity issuing the Application to the general public;</p> \
    <p>‘End Users’ means the persons using the Application including you; and ‘End User’ shall be construed accordingly;</p> \
    <p>‘End User’s Data’ means any Data that you display or otherwise provide to the Application which you own, or which you are licensed by a third party to use (under terms which are consistent with the terms of these Terms of Use). However, End User’s Data does not include Derived Data that you own pursuant to Clause 2.3(a). By way of example, but without limitation, End User’s Data would include any independently sourced GPS trace plotted by you on the Application;</p> \
    <p>‘Financial Gain’ means any payment, revenue, credit, or money’s worth received by, or accruing to the Developer, you (or any third party used by or connected to Developer or you) (directly or indirectly) for: (i) accessing and using the Application; and/or (ii) viewing, downloading, using or exploiting any Ordnance&nbsp;Survey Data (or Derived Data owned by Ordnance&nbsp;Survey);</p> \
    <p>‘Intellectual Property Rights or IPR’ means copyright, patent, trade mark, design right, database rights, trade secrets, know how, rights of confidence, broadcast rights and all other similar rights anywhere in the world whether or not registered and including applications for registration of any of them;</p> \
    <p>‘OpenSpace API’ means the JavaScript application programming interface created by Ordnance&nbsp;Survey to allow developers to build applications using Ordnance&nbsp;Survey mapping data (which consists of the OpenSpace JavaScript Libraries and various open source software), as such may be amended from time to time;</p> \
    <p>‘OpenSpace SDK’ means one of the mapping data software development kits created and made available by Ordnance&nbsp;Survey and licensed under an open source licence, the terms of which are located at the following url: <a href='https://github.com/OrdnanceSurvey'>https://github.com/OrdnanceSurvey</a>;</p> \
    <p>‘Open Space JavaScript Library (Libraries)’ means a proprietary JavaScript library created by Ordnance&nbsp;Survey and supplied to the Developer as part of the OpenSpace API, which Ordnance&nbsp;Survey licenses pursuant to the BSD open source licence, as such may be amended from time to time;</p> \
    <p>‘Ordnance&nbsp;Survey Data’ means Data owned by or licensed to Ordnance&nbsp;Survey (including as applicable Derived Data), a feed of which is made available by OS OpenSpace, which may be accessed and processed by the Application;</p> \
    <p>‘OS OpenSpace or OS OpenSpace Service’ means the services provided by Ordnance&nbsp;Survey through which the Developer and/or End Users, can access a feed of Ordnance&nbsp;Survey Data through the OpenSpace API;</p> \
    <p>‘Screen Shot’ means a screen shot, capture or grab of a complete page from the Application which includes a visible map image of Ordnance&nbsp;Survey Data. For the avoidance of doubt, the map image must not be provided as a download. </p> \
    <p>‘User Generated Route’ means a course between a start location and a destination that is manually created by End User selecting and identifying a series of Waypoints on the Application, each of which Waypoints is joined by a straight line to the next Waypoint in the series and in the order that an End User would wish to travel; and</p> \
    <p>‘Waypoint’ means a point of reference selected by an End User using the Application, which consists merely of a set of co-ordinates that identify the point in physical space. </p> \
    \
    <h4>2 Proprietary Rights, Licence and Restrictions</h4> \
    \
    <h5>2.1 Ownership of Intellectual Property</h5> \
    <p>The Crown (or where applicable Ordnance&nbsp;Survey’s suppliers) owns the Intellectual Property Rights in the Ordnance&nbsp;Survey Data which is made available to End Users through and/or as part of the Application. The End User acknowledges and agrees that these Terms of Use conveys a limited right to use the Ordnance&nbsp;Survey Data and does not convey title or ownership to the Ordnance&nbsp;Survey Data to the End User.</p> \
    \
    <h5>2.2 Licence Grant</h5> \
    <p>The Developer grants to End Users a personal, non-exclusive, non-transferable, licence solely for the End User’s own personal, non commercial use (terminable at will and without any right to sublicense) to:</p> \
    <p>a) request from Ordnance&nbsp;Survey’s server the Ordnance&nbsp;Survey Data and view, use, and display the same through and as part of the Application on/from a single computer (including hand held), or mobile or GPS device;</p> \
    <p>b) create Waypoints and/or User Generated Routes through and as part of the Application and view and download Waypoints and/or User Generated Routes on and to a single computer (including hand-held) or GPS device;</p> \
    <p>c) print:</p> \
    <p>i) a maximum of ten (10) paper copies no greater than A4 (625 cm2) in size of any Screen Shot for the End-User’s personal or non-commercial use.</p> \
    <p>ii) more than ten (10) paper copies, no greater than A4 (625cm2) in size of any Screen Shot for use in presentations given by the End User where the purpose is to provide a single copy of the Screen Shot to each participant of a presentation given by the End User.</p> \
    <p>provided that:</p> \
    <p>i) The OS OpenSpace logo and copyright acknowledgement form part of the map image; and</p> \
    <p>ii) The Screen Shot includes content emanating from the Application and is not solely a map image.</p> \
    <p>For the avoidance of doubt, for all other publications of Screen Shots, an appropriate licence is required.</p> \
    \
    <h5>2.3 Derived Data</h5> \
    <p>a) In the event that any End User creates Derived Data, End User acknowledges and agrees that such Derived Data shall automatically be assigned immediately on creation to Ordnance&nbsp;Survey, save that if any Derived Data is created by any End User which is a severable improvement (as defined by Commission Regulation (EC) No 772/2004, known as the Technology Transfer Block Exemption) of the Ordnance&nbsp;Survey Data then such Derived Data shall be owned by the End User.</p> \
    <p>b) In respect of any Derived Data Ordnance&nbsp;Survey owns pursuant to Clause 2.3(a) above, then subject to all of these Terms of Use, but without prejudice to Clause 2.2(b), the Developer hereby grants End User a perpetual, non exclusive, royalty-free, paid up, personal licence to use and display such Derived Data as part of the Application used to create the same.</p> \
    <p>c) In respect of any Derived Data an End User owns pursuant to Clause 2.3(a) above, then for the period during which End User submits, posts, or displays such Derived Data on the Application, End User, or Developer (as the case may be), grants to Ordnance&nbsp;Survey a revocable, world-wide, royalty-free, and non-exclusive licence to use, display and distribute such Derived Data solely for the purpose of allowing: (i) Ordnance&nbsp;Survey to deliver the OS OpenSpace service to the Developer and End Users; and (ii) Developer to deliver the Application to End Users. Such licence will terminate immediately the End User and/or the Developer (as the case may be) ceases to use the Application to submit, post or display such Derived Data, and/or the Developer ceases to deliver the Application.</p> \
    \
    <h5>2.4 End User’s Data</h5> \
    <p>In the event that End User submits, posts and displays End User’s Data in or to the Application:</p> \
    <p>a)Ordnance&nbsp;Survey does not claim any ownership in such End User’s Data. However, for the period during which End User submits, posts, or displays such End User’s Data on the Application, End User, or Developer (as the case may be), grants to Ordnance&nbsp;Survey a revocable, world-wide, royalty-free, and non-exclusive licence to use, display and distribute such End User’s Data solely for the purpose of allowing (i) Ordnance&nbsp;Survey to deliver the OS OpenSpace service to the Developer and End Users; and (ii) Developer to deliver the Application to End Users. Such licence will terminate immediately the End User and/or Developer ceases to use the Application to submit, post or display such End User’s Data, and/or the Developer ceases to deliver the Application;</p> \
    <p>b)End User hereby warrants to Ordnance&nbsp;Survey that End User has all the necessary permissions and authorisations from the owners of any Intellectual Property Rights subsisting in the End User’s Data to use and grant licenses to use such Intellectual Property Rights under these Terms of Use.</p> \
    <p><strong>2.5 Restrictions</strong></p> \
    <p>Except as expressly permitted under these Terms of Use, the licences granted in Clauses 2.2 – 2.3 above are subject to End User complying with the following conditions.</p> \
    <p>a) End User shall not submit, post or display any advertising that, in the reasonable opinion of Ordnance&nbsp;Survey, may be (i) illegal, deceptive, misleading, unethical or otherwise inappropriate, or (ii) may be associated with any of the foregoing or otherwise inappropriate goods or services on or to the Application;</p> \
    <p>b) End User shall not use the Application for, or in connection with, any Financial Gain;</p> \
    <p>c) Subject to Clause 2.2(b) above and Sub-Clauses 2.5(d) below, End User shall not download, store, and/or archive the Ordnance&nbsp;Survey Data, in whole or in part on to a single computer (including hand held), or mobile or GPS device, save for Caching;</p> \
    <p>d) End User shall not tamper with or remove any copyright, trade mark, trade mark symbol or other proprietary notice of Ordnance&nbsp;Survey or its licensors affixed to, or contained in the Ordnance&nbsp;Survey Data.</p> \
    <p>All rights and permissions not expressly set out in this Clause 2 are expressly excluded.</p> \
    \
    <h4>3 Limited Warranty; Disclaimer of Warranty</h4> \
    \
    <h5>3.1 Exclusions</h5> \
    <p>No warranty is given that the Ordnance&nbsp;Survey Data shall meet End User’s particular requirements, whether operationally, functionally, accurately or otherwise, or that the Ordnance&nbsp;Survey Data shall be suitable for the End User’s intended purpose or that operation of the Ordnance&nbsp;Survey Data shall be uninterrupted or error free. Under no circumstances shall Ordnance&nbsp;Survey or its licensors be liable for any loss or corruption of End User’s data.</p> \
    \
    <h5>3.2 Disclaimer of Warranties</h5> \
    <p>Ordnance&nbsp;Survey and its licensors disclaim all warranties and conditions, either express or implied, with respect to the Ordnance&nbsp;Survey Data and further disclaim any warranty that the functions contained in the Ordnance&nbsp;Survey Data shall meet End User’s requirements or shall operate in combinations or in a manner selected for use by End User, or that the operation and/or provision of the Ordnance&nbsp;Survey Data shall be uninterrupted or error free.</p> \
    \
    <h4>4 Limitation of Liability</h4> \
    \
    <h5>4.1 Limitation of Liability</h5>\
    <p>Save in respect of death or personal injury to the extent it results from negligence or fraud, Ordnance&nbsp;Survey and its licensors disclaim all liability whether in contract, tort (including negligence) or otherwise for any loss or damage of whatsoever nature arising from any use of the Ordnance&nbsp;Survey Data or from any interruption or failure of any electronic transmission of Ordnance&nbsp;Survey Data.</p> \ \ \
    \
    <h5>4.2 Exclusion of Consequential Damages</h5> \
    <p>Under no circumstances shall Ordnance&nbsp;Survey and its licensors be liable (i) for costs of procurement of substitute products by End User; and (ii) in contract, tort (including negligence) or otherwise for any direct, indirect, special or consequential losses or damages, or any loss of profits, loss of business or loss of contracts.</p> \
    \
    <h5>4.3 Remedies of Ordnance&nbsp;Survey</h5> \
    <p>Ordnance&nbsp;Survey and/or its licensors may directly recover from the End User all amounts lawfully due in respect of any breaches of these Terms of Use by the End User (including but without limitation a breach of Clause 2.4) which cause Ordnance&nbsp;Survey to suffer loss or damage.</p> \
    \
    <h4>5 Data Protection</h4> \
    \
    <h5>5.1 Data Protection</h5> \
    <p>The Developer shall protect the End User’s personal data in accordance with all applicable legislation.</p> \
    \
    <h4>6 Termination</h4> \
    \
    <h5>6.1 Termination</h5> \
    <p>The Developer has the right to terminate End User’s use of the Application and/or the Ordnance&nbsp;Survey Data (but not the Derived Data owned by the End User pursuant to Clause 2.3(a)) immediately on notice to the End User. On termination of these Terms of Use, the licences granted to the End User herein shall terminate immediately and the End User shall take all steps reasonably possible to return or destroy the relevant Ordnance&nbsp;Survey Data.</p> \
    \
    <h4>7 Other Terms</h4> \
    \
    <h5>7.1 Compliance with Laws</h5> \
    <p>The End User shall comply with all applicable local and foreign laws and regulations which may govern the use of the Ordnance&nbsp;Survey Data and use the Ordnance&nbsp;Survey Data only for lawful purposes and in accordance with these Terms of Use. End User acknowledges that the Developer and its licensors exercise no control whatsoever over the Ordnance&nbsp;Survey Data and that it is the sole responsibility of End User to ensure that any content End User transmits and receives by means of the Application and/or the Ordnance&nbsp;Survey Data complies with all applicable laws.</p> \
    \
    <h5>7.2 Survival</h5> \
    <p>Clauses 1, 2.1, 2.3(a), 2.4(b), 3, 4, 7.2 and 7.3 inclusive shall survive termination of these Terms of Use for any reason.</p> \
    \
    <h5>7.3 Governing Law and Jurisdiction</h5> \
    <p>These Terms of Use shall be governed by and construed in accordance with English law and the parties submit to the exclusive jurisdiction of the English courts in respect of any proceedings issued by any party in connection with these Terms of Use</p>";  return L.OSOpenSpace;

  return L.OSOpenSpace;
}));
