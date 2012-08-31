/**
 * WMTS Format with WMTS Limits
 *
 */
WMTSFormatWithLimits = OpenLayers.Class(OpenLayers.Format.OWSCommon.v1_1_0, {

	/**
	 * Property: version {String} The
	 * parser version ("1.0.0").
	 */
	version : "1.0.0",

	/**
	 * Property: namespaces {Object}
	 * Mapping of namespace aliases to
	 * namespace URIs.
	 */
	namespaces : {
		ows : "http://www.opengis.net/ows/1.1",
		wmts : "http://www.opengis.net/wmts/1.0",
		xlink : "http://www.w3.org/1999/xlink"
	},

	/**
	 * Property: yx {Object} Members in
	 * the yx object are used to
	 * determine if a CRS URN
	 * corresponds to a CRS with y,x
	 * axis order. Member names are CRS
	 * URNs and values are boolean.
	 * Defaults come from the
	 * <OpenLayers.Format.WMTSCapabilities>
	 * prototype.
	 */
	yx : null,

	/**
	 * Property: defaultPrefix {String}
	 * The default namespace alias for
	 * creating element nodes.
	 */
	defaultPrefix : "wmts",

	/**
	 * Constructor:
	 * OpenLayers.Format.WMTSCapabilities.v1_0_0
	 * Create a new parser for WMTS
	 * capabilities version 1.0.0.
	 *
	 * Parameters: options - {Object} An
	 * optional object whose properties
	 * will be set on this instance.
	 */
	initialize : function(options) {
		OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
		this.options = options;
		var yx = OpenLayers.Util.extend({}, OpenLayers.Format.WMTSCapabilities.prototype.yx);
		this.yx = OpenLayers.Util.extend(yx, this.yx);
	},
	/**
	 * APIMethod: read Read capabilities
	 * data from a string, and return
	 * info about the WMTS.
	 *
	 * Parameters: data - {String} or
	 * {DOMElement} data to read/parse.
	 *
	 * Returns: {Object} Information
	 * about the SOS service.
	 */
	read : function(data) {
		if( typeof data == "string") {
			data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
		}
		if(data && data.nodeType == 9) {
			data = data.documentElement;
		}
		var capabilities = {};
		this.readNode(data, capabilities);
		capabilities.version = this.version;
		return capabilities;
	},
	props : {
		'wmts' : {
			'TileMatrixLimits' : {
				"MinTileRow" : ["minTileRow", parseInt],
				"MaxTileRow" : ["maxTileRow", parseInt],
				"MinTileCol" : ["minTileCol", parseInt],
				"MaxTileCol" : ["maxTileCol", parseInt],
				"TileMatrix" : ["tileMatrix", null]
			}
		}
	},
	/**
	 * Property: readers Contains public
	 * functions, grouped by namespace
	 * prefix, that will be applied when
	 * a namespaced node is found
	 * matching the function name. The
	 * function will be applied in the
	 * scope of this parser with two
	 * arguments: the node being read
	 * and a context object passed from
	 * the parent.
	 */
	readers : {

		"wmts" : {
			"Capabilities" : function(node, obj) {
				this.readChildNodes(node, obj);
			},
			"Contents" : function(node, obj) {
				obj.contents = {};
				obj.contents.layers = [];
				obj.contents.tileMatrixSets = {};
				this.readChildNodes(node, obj.contents);
			},
			"Layer" : function(node, obj) {
				var layer = {
					styles : [],
					formats : [],
					tileMatrixSetLinks : [],
					tileMatrixSetLinksMap : {}
				};
				layer.layers = [];
				this.readChildNodes(node, layer);
				obj.layers.push(layer);
			},
			"Style" : function(node, obj) {
				var style = {};
				style.isDefault = (node.getAttribute("isDefault") === "true");
				this.readChildNodes(node, style);
				obj.styles.push(style);
			},
			"Format" : function(node, obj) {
				obj.formats.push(this.getChildValue(node));
			},
			"TileMatrixSetLink" : function(node, obj) {
				var tileMatrixSetLink = {};
				this.readChildNodes(node, tileMatrixSetLink);
				obj.tileMatrixSetLinks.push(tileMatrixSetLink);
				obj.tileMatrixSetLinksMap[tileMatrixSetLink.tileMatrixSet] = tileMatrixSetLink;
			},
			"TileMatrixSet" : function(node, obj) {
				// node
				// could be
				// child of
				// wmts:Contents
				// or
				// wmts:TileMatrixSetLink
				// duck type
				// wmts:Contents
				// by
				// looking
				// for
				// layers
				if(obj.layers) {
					// TileMatrixSet
					// as
					// object
					// type
					// in
					// schema
					var tileMatrixSet = {
						matrixIds : []
					};
					this.readChildNodes(node, tileMatrixSet);
					obj.tileMatrixSets[tileMatrixSet.identifier] = tileMatrixSet;
				} else {
					// TileMatrixSet
					// as
					// string
					// type
					// in
					// schema
					obj.tileMatrixSet = this.getChildValue(node);
				}
			},
			"TileMatrix" : function(node, obj) {
				var tileMatrix = {
					supportedCRS : obj.supportedCRS
				};
				this.readChildNodes(node, tileMatrix);
				obj.matrixIds.push(tileMatrix);
			},
			"ScaleDenominator" : function(node, obj) {
				obj.scaleDenominator = parseFloat(this.getChildValue(node));
			},
			"TopLeftCorner" : function(node, obj) {
				var topLeftCorner = this.getChildValue(node);
				var coords = topLeftCorner.split(" ");
				// decide on
				// axis
				// order for
				// the
				// given CRS
				var yx;
				if(obj.supportedCRS) {
					// extract
					// out
					// version
					// from
					// URN
					var crs = obj.supportedCRS.replace(/urn:ogc:def:crs:(\w+):.+:(\w+)$/, "urn:ogc:def:crs:$1::$2");
					yx = !!this.yx[crs];
				}
				if(yx) {
					obj.topLeftCorner = new OpenLayers.LonLat(coords[1], coords[0]);
				} else {
					obj.topLeftCorner = new OpenLayers.LonLat(coords[0], coords[1]);
				}
			},
			"TileWidth" : function(node, obj) {
				obj.tileWidth = parseInt(this.getChildValue(node));
			},
			"TileHeight" : function(node, obj) {
				obj.tileHeight = parseInt(this.getChildValue(node));
			},
			"MatrixWidth" : function(node, obj) {
				obj.matrixWidth = parseInt(this.getChildValue(node));
			},
			"MatrixHeight" : function(node, obj) {
				obj.matrixHeight = parseInt(this.getChildValue(node));
			},
			"ResourceURL" : function(node, obj) {
				obj.resourceUrl = obj.resourceUrl || {};
				obj.resourceUrl[node.getAttribute("resourceType")] = {
					format : node.getAttribute("format"),
					template : node.getAttribute("template")
				};
			},
			// not used for
			// now, can be
			// added in
			// the future
			// though
			/*
			 * "Themes": function(node,
			 * obj) { obj.themes = [];
			 * this.readChildNodes(node,
			 * obj.themes); }, "Theme":
			 * function(node, obj) { var
			 * theme = {};
			 * this.readChildNodes(node,
			 * theme); obj.push(theme); },
			 */
			"WSDL" : function(node, obj) {
				obj.wsdl = {};
				obj.wsdl.href = node.getAttribute("xlink:href");
				// TODO:
				// other
				// attributes
				// of
				// <WSDL>
				// element
			},
			"ServiceMetadataURL" : function(node, obj) {
				obj.serviceMetadataUrl = {};
				obj.serviceMetadataUrl.href = node.getAttribute("xlink:href");
				// TODO:
				// other
				// attributes
				// of
				// <ServiceMetadataURL>
				// element
			},
			"TileMatrixSetLimits" : function(node, obj) {

				var tileMatrixSetLimits = {
					tileMatrixLimits : []
				};

				obj.tileMatrixSetLimits = tileMatrixSetLimits;

				/**
				 * Too deep recursion
				 * and you'll break IE
				 * Let's see what
				 * happens
				 */
				this.readChildNodes(node, tileMatrixSetLimits);

				/**
				 * Let's enhance
				 * original data
				 * assuming single entry
				 * per tileMatrix URI
				 * (should read spec)
				 */
				var tileMatrixSetLimitsMap = {};

				for(var n = 0; n < tileMatrixSetLimits.tileMatrixLimits.length; n++) {
					var limit = tileMatrixSetLimits.tileMatrixLimits[n];
					tileMatrixSetLimitsMap[limit.tileMatrix] = limit;
				}

				obj.tileMatrixSetLimitsMap = tileMatrixSetLimitsMap;

			},
			"TileMatrixLimits" : function(node, obj) {

				var nodes = this.getElementsByTagNameNS(node, this.namespaces.wmts, '*');
				var props = this.props.wmts['TileMatrixLimits'];

				var tileMatrixLimits = {};

				for(var n = 0; n < nodes.length; n++) {
					var nd = nodes[n];
					// .item(n);
					var val = this.getChildValue(nd);
					var local = nd.localName || nd.nodeName.split(":").pop();
					var prop = props[local][0];
					var propFunc = props[local][1];
					tileMatrixLimits[prop] = propFunc ? propFunc(val) : val;
				}

				/**
				 *
				 */

				obj.tileMatrixLimits.push(tileMatrixLimits);
			}
		},
		/**
		 * Let's override DCP/HTTP[Get]
		 */
		"ows" : OpenLayers.Util.applyDefaults({
			"HTTP" : function(node, dcp) {
				dcp.http = {};
				this.readChildNodes(node, dcp.http);
			},
			"Get" : function(node, http) {
				var href = this.getAttributeNS(node, this.namespaces.xlink, "href");

				if(!http.get)
					http.get = href;

				if(!http.getArray)
					http.getArray = [];

				http.getArray.push(href);

			}
		}, OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers["ows"])
	},
	CLASS_NAME : "WMTSFormatWithLimits"

});