/**
 * Bundle
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.Sade3Bundle",

				function() {
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {
						this.applyPatches();
						return Oskari.clazz
								.create("Oskari.mapframework.bundle.Sade3BundleInstance");
					},

					"update" : function(manager, bundle, bi, info) {
						manager.alert("RECEIVED update notification " + info);
					},
					
					"applyPatches" : function() {
						
						/**
						 * OpenLayers ei osannut muodostaa Geometrysta Filteriin rajausta. Piti fixaa
						 * t�m�kin. Sekoilee namespaces viittausten kanssa jotenkin. "feature"
						 * namespacea ei ollut olemassakkaan. Ilmeisesti se jotenkin asetettaisiin
						 * featureNS tms. kautta, mutta j�i ep�selv�ksi miss� ja miksi on ongelma, kun
						 * tuo on kyll� asetettu.
						 * 
						 * Ilmeisesti liittyy WFS Procollaan koodattuun featureNs autodetect juttuun.
						 * Pit�� setvi�.
						 * 
						 * if(!this.featureNS && this.featurePrefix) { // featureNS autodetection var
						 * readNode = this.format.readNode; this.format.readNode = function(node, obj) {
						 * if(!this.featureNS && node.prefix == this.featurePrefix) { this.featureNS =
						 * node.namespaceURI; this.setNamespace("feature", this.featureNS); } return
						 * readNode.apply(this, arguments); }; }
						 * 
						 */

						// OIKEA PATCH, joka lukee my�s substitutionGroup attribuutin
						OpenLayers.Format.WFSDescribeFeatureType.prototype.readers.xsd['element'] = function(
								node, obj) {
							if (obj.elements) {
								var element = {};
								var attributes = node.attributes;
								var attr;
								for ( var i = 0, len = attributes.length; i < len; ++i) {
									attr = attributes[i];
									element[attr.name] = attr.value;
								}

								var type = element.type;
								if (!type) {
									type = {};
									this.readChildNodes(node, type);
									element.restriction = type;
									element.type = type.base;
								}
								var fullType = type.base || type;
								element.localType = fullType.split(":").pop();
								obj.elements.push(element);
							}

							if (obj.complexTypes) {
								var substGroupVal = node.getAttribute("substitutionGroup");
								var substGroup = null;
								if (substGroupVal) {
									var parts = substGroupVal.split(":");
									var featureName = parts[1];
									var featurePrefix = parts[0];
									var featureNS = this.lookupNamespaceURI(node, featurePrefix);

									substGroup = {
										featureNS : featureNS,
										featureName : featureName
									};
								}
								var type = node.getAttribute("type");
								var localType = type.split(":").pop();
								obj.customTypes[localType] = {
									"name" : node.getAttribute("name"),
									"type" : type,
									"substitutionGroup" : substGroup
								};
							}
						};

						OpenLayers.Format.WFSDescribeFeatureType.prototype.readers.xsd['schema'] = function(
								node, obj) {
							var complexTypes = [];
							var customTypes = {};
							var schema = {
								complexTypes : complexTypes,
								customTypes : customTypes
							};

							this.readChildNodes(node, schema);

							var attributes = node.attributes;
							var attr, name;
							for ( var i = 0, len = attributes.length; i < len; ++i) {
								attr = attributes[i];
								name = attr.name;
								if (name.indexOf("xmlns") == 0) {
									this.setNamespace(name.split(":")[1] || "", attr.value);
								} else {
									obj[name] = attr.value;
								}
							}
							obj.featureTypes = complexTypes;
							obj.targetPrefix = this.namespaceAlias[obj.targetNamespace];

							// map complexTypes to names of customTypes
							var complexType, customType;
							for ( var i = 0, len = complexTypes.length; i < len; ++i) {
								complexType = complexTypes[i];
								customType = customTypes[complexType.typeName];
								if (customTypes[complexType.typeName]) {
									complexType.typeName = customType.name;
									complexType.substitutionGroup = customType.substitutionGroup;
								}
							}
						};

						// PATCH:
						// http://trac.openlayers.org/attachment/ticket/2009/intersects_bbox.patch
						// JOHDETTU TOTEUTUSTA, jotta toimii Feature rajaus

						OpenLayers.Format.WFST.v1_1_0.prototype.filterMap = {
							"&&" : "And",
							"||" : "Or",
							"!" : "Not",
							"==" : "PropertyIsEqualTo",
							"!=" : "PropertyIsNotEqualTo",
							"<" : "PropertyIsLessThan",
							">" : "PropertyIsGreaterThan",
							"<=" : "PropertyIsLessThanOrEqualTo",
							">=" : "PropertyIsGreaterThanOrEqualTo",
							".." : "PropertyIsBetween",
							"~" : "PropertyIsLike",
							"BBOX" : "BBOX",
							"DWITHIN" : "DWITHIN",
							"WITHIN" : "WITHIN",
							"CONTAINS" : "CONTAINS",
							"TOUCHES" : "TOUCHES",
							"OVERLAPS" : "OVERLAPS",
							"INTERSECTS" : "INTERSECTS",
							"EQUALS" : "EQUALS"
						};

						OpenLayers.Format.WFST.v1_1_0.prototype.getFilterType = function(filter) {
							var filterType = this.filterMap[filter.type];
							if (!filterType) {
								throw "" + this.CLASS_NAME
										+ "Filter writing not supported for rule type: " + filter.type;
							}
							return filterType;
						};
						OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc["writeSpatial"] = function(
								opt) {

							var filter = opt.filter;
							var name = opt.name;
							var node = this.createElementNSPlus("ogc:" + name);

							this.writeNode("PropertyName", filter, node);
							var child;

							if (filter.value.CLASS_NAME
									&& filter.value.CLASS_NAME.indexOf("OpenLayers.Geometry") != -1) {
								var geom = filter.value;
								var type = this.geometryTypes[geom.CLASS_NAME];

								child = this.writeNode("gml:" + type, geom, node);
								if (this.srsName) {
									child.setAttribute("srsName", this.srsName);
								}

							} else {
								child = this.writeNode("gml:Envelope", filter.value);
							}
							if (filter.projection) {
								child.setAttribute("srsName", filter.projection);
							}
							node.appendChild(child);
							return node;
						};

						OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc["BBOX"] = function(filter) {
							return this.writeNode("ogc:writeSpatial", {
								filter : filter,
								name : "BBOX"
							});
						};
						OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc["DWITHIN"] = function(
								filter) {
							var node = this.writeNode("ogc:writeSpatial", {
								filter : filter,
								name : "DWithin"
							});
							this.writeNode("Distance", filter, node);
							return node;
						};
						OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc["CONTAINS"] = function(
								filter) {
							return this.writeNode("ogc:writeSpatial", {
								filter : filter,
								name : "Contains"
							});
						};
						OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc["WITHIN"] = function(
								filter) {
							return this.writeNode("ogc:writeSpatial", {
								filter : filter,
								name : "Within"
							});
						};
						OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc["TOUCHES"] = function(
								filter) {
							return this.writeNode("ogc:writeSpatial", {
								filter : filter,
								name : "Touches"
							});
						};
						OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc["OVERLAPS"] = function(
								filter) {
							return this.writeNode("ogc:writeSpatial", {
								filter : filter,
								name : "Overlaps"
							});
						};
						OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc["INTERSECTS"] = function(
								filter) {
							return this.writeNode("ogc:writeSpatial", {
								filter : filter,
								name : "Intersects"
							});
						};
						OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc["EQUALS"] = function(
								filter) {
							return this.writeNode("ogc:writeSpatial", {
								filter : filter,
								name : "Equals"
							});
						};

						// PATCH LOPPUU


						
					}

				},

				/**
				 * metadata
				 */
				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [
						             {
						            	 "type" : "text/css",
						            	 "src" : "style.css"
 						             },
								{
									"type" : "text/javascript",
									"src" : "instance.js"
								},
								{
									"type" : "text/javascript",
									"src" : "layermanager.js"
								},
								{
									"type" : "text/javascript",
									"src" : "Sade3App.js"
								},
								/*{
									type : "text/javascript",
									src : "impl/nlsfi-js-app/NLSFI/OpenLayersPatches.js"
								},*/
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-lib/NLSFI/OpenLayers/Strategy/TileQueue.js"
								},
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-lib/NLSFI/OpenLayers/Strategy/QueuedTilesGrid.js"
								},
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-lib/NLSFI/OpenLayers/Strategy/QueuedTilesStrategy.js"
								},
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-lib/NLSFI/OpenLayers/Format/GML/ArcInterPoints.js"
								},
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-lib/NLSFI/OpenLayers/Format/GML/KTJkiiWFS.js"
								},
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-lib/NLSFI/OpenLayers/Format/GML/WFSResponse.js"
								},
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-lib/NLSFI/OpenLayers/Format/GML/KTJkiiMappletGML.js"
								},
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-lib/NLSFI/OpenLayers/Format/GML/KTJkiiAtp.js"
								},
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-lib/NLSFI/OpenLayers/Format/WFS/WFSCapabilities.js"
								},
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-lib/NLSFI/OpenLayers/Filter/LogoFilter.js"
								},
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-app/NLSFI/Worker/Scheduler.js"
								},
								{
									type : "text/javascript",
									src : "impl/nlsfi-js-app/NLSFI/Worker/WFSWorker.js"
								},
								{
									type : "text/javascript",
									src : "impl/sade-js-app/SADE/service/KTJkiiWFS.js"
								},
								{
									type : "text/javascript",
									src : "impl/sade-js-app/SADE/service/NimistoWFS.js"
								},
								{
									type : "text/javascript",
									src : "impl/sade-js-app/SADE/service/RakennustiedotWFS.js"
								},
								{
									type : "text/javascript",
									src : "impl/sade-js-app/SADE/service/MaastoWFS.js"
								}, {
									type : "text/javascript",
									src : "mapplet.js"
								}, {
									type : "text/javascript",
									src : "worker.js"
								}, {
									type : "text/javascript",
									src : "locale.js"
								}, {
									type : "text/javascript",
									src : "mediator.js"
								}, {
									type : "text/javascript",
									src : "ui/form.js"
								}, {
									type : "text/javascript",
									src : "ui/ui.js"
								}, {
									type : "text/javascript",
									src : "adapter.js"
								}

						/*
						 * { "type" : "text/javascript", "src" :
						 * "../src/mapframework/bundle/sade3/ui/module/map-controls-module.js" }
						 */],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "sade3",
							"Bundle-Name" : "sade3",
							"Bundle-Icon" : {
								"href" : "icon.png"
							},
							"Bundle-Author" : [ {
								"Name" : "jjk",
								"Organisation" : "nls.fi",
								"Temporal" : {
									"Start" : "2009",
									"End" : "2011"
								},
								"Copyleft" : {
									"License" : {
										"License-Name" : "EUPL",
										"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
									}
								}
							} ],
							"Bundle-Name-Locale" : {
								"fi" : {
									"Name" : "Haku",
									"Title" : "Haku"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari", "Ext" ]
						}
					}
				});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("sade3",
		"Oskari.mapframework.bundle.Sade3Bundle");