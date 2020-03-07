sap.ui.define(
	["sap/base/util/ObjectPath", "sap/ui/thirdparty/datajs", "sap/ushell/services/Container"],
	function (ObjectPath) {
		"use strict";
		
		// define ushell config
		ObjectPath.set(["sap-ushell-config"], {
			defaultRenderer: "fiori2",
			bootstrapPlugins: {
				RuntimeAuthoringPlugin: {
					component: "sap.ushell.plugins.rta",
					config: {
						validateAppVersion: false
					}
				},
				PersonalizePlugin: {
					component: "sap.ushell.plugins.rta-personalize",
					config: {
						validateAppVersion: false
					}
				}
			},
			renderers: {
				fiori2: {
					componentData: {
						config: {
							enableSearch: false,
							rootIntent: "Shell-home"
						}
					}
				}
			},
			services: {
				LaunchPage: {
					adapter: {
						config: {
							groups: [{
								tiles: [{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Moniton Market Processes",
										targetURL: "#UtilsDataExchangeProcessing-displayProcess"
									}
								}, {
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Display Market Messages",
										targetURL: "#UtilsDataExchangeProcessing-displayMessage"
									}
								}, {
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Overview Market Processes",
										targetURL: "#UtilsDataExchangeProcessing-overviewProcess"
									}
								}, {
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Overview Market Message",
										targetURL: "#UtilsDataExchangeProcessing-overviewMessage"
									}
								}, {
									tileType: "sap.ushell.ui.tile.DynamicTile",
									properties: {
										title: "Monitor Mass Meter Readings",
										targetURL: "#UtilsDataExchangeProcessing-massMeterReading",
										//serviceUrl: "/sap/opu/odata/MP4G/UI_MASSPROCMTRREAD/xMP4GxC_MassProcMRCount/$count",
										numberValue: this.numberValue1
										
									}
								}, {
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Monitor Invoice Meter Readings",
										targetURL: "#UtilsDataExchangeProcessing-invoicemeterreadings"
									}
								}]
							}, {
								id: "defaultGroupId2",
								title: "Market Communication Technical Self Service",
								tiles: [{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Execute Process Reports",
										targetURL: "#UtilsDataExchangeProcessing-processUiAction"
									}
								}]
							}, {
								id: "defaultGroupId3",
								title: "Market Communication Business Self Service",
								tiles: [{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Display Market Partners",
										icon: "sap-icon://BusinessSuiteInAppSymbols/icon-business-partner",
										targetURL: "#UtilsDataExchangeProcessing-displayMarketPartner"
									}
								}]
							}]
						}
					}
				},
				ClientSideTargetResolution: {
					adapter: {
						config: {
							inbounds: {
								"UtilsDataExchangeProcessing-displayProcess": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "displayProcess",
									description: "Moniton Market Processes",
									title: "Moniton Market Processes",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "URL",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.displayprocesses",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/displayprocesses"
										)
									}
								},
								"UtilsDataExchangeProcessing-displayMessage": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "displayMessage",
									description: "Display Market Messages",
									title: "Display Market Messages",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "URL",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.displaymessages",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/displaymessages"
										)
									}
								},
								"UtilsDataExchangeProcessing-overviewProcess": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "overviewProcess",
									description: "Overview Market Processes",
									title: "Overview Market Processes",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.overviewprocesses",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/overviewprocesses"
										)
									}
								},
								"UtilsDataExchangeProcessing-overviewMessage": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "overviewMessage",
									description: "OverView Message",
									title: "OverView Message",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.overviewmessages",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/overviewmessages"
										)
									}
								},
								"UtilsDataExchangeProcessing-massMeterReading": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "massMeterReading",
									description: "Monitor Mass Meter Readings",
									title: "Monitor Mass Meter Readings",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.massmeterreadings",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/massmeterreadings"
										)
									}
								},
								"UtilsDataExchangeProcessing-invoiceMeterReading": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "invoiceMeterReading",
									description: "Monitor Invoice Meter Readings",
									title: "Monitor Invoice Meter Readings",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.invoicemeterreadings",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/invoicemeterreadings"
										)
									}
								},
								"UtilsDataExchangeProcessing-processUiAction": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "processUiAction",
									description: "Execute Process Reports",
									title: "Execute Process Reports",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.processuiactions",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/processuiactions"
										)
									}
								},
								"UtilsDataExchangeProcessing-displayMarketPartner": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "displayMarketPartner",
									description: "Display Market Partners",
									title: "Display Market Partners",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.selfservice.ui.app.displaymarketpartners",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/selfservice/ui/app/displaymarketpartners"
										)
									}
								}
							}
						}
					}
				},
				NavTargetResolution: {
					config: {
						enableClientSideTargetResolution: true
					}
				}
			}
		});

		var oFlpSandbox = {
			init: function () {
				/**
				 * Initializes the FLP sandbox
				 * @returns {Promise} a promise that is resolved when the sandbox bootstrap has finshed
				 */

				// sandbox is a singleton, so we can start it only once
				if (!this._oBootstrapFinished) {
					this._oBootstrapFinished = sap.ushell.bootstrap("local");
					this._oBootstrapFinished.then(function () {
						sap.ushell.Container.createRenderer().placeAt("content");
					});
				}
				
				// window.setInterval(function () {
    //                 OData.read("/sap/opu/odata/MP4G/UI_MASSPROCMTRREAD/xMP4GxC_MassProcMRCount/$count",
    //                     function (iCount) {
    //                     	this.numberValue1 = 1;
    //                     }.bind(this),
    //                     function (sMessage) {
    //                     });
    //             }, 10000);

				return this._oBootstrapFinished;
			}
		};

		return oFlpSandbox;
	});