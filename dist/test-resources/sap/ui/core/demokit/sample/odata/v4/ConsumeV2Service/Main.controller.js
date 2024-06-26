/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller"
], function (MessageBox, Controller) {
	"use strict";

	return Controller.extend("sap.ui.core.sample.odata.v4.ConsumeV2Service.Main", {
		onResetEntity : function () {
			var oView = this.getView();

			oView.byId("resetEntityButton").getObjectBinding().invoke()
				.then(function () {
					// Note: refresh is needed as long as there is no cache synchronization
					oView.getModel().refresh();
					MessageBox.alert("Data successfully reset", {
						icon : MessageBox.Icon.SUCCESS,
						title : "Success"
					});
				}, function (oError) {
					MessageBox.alert(oError.message, {
						icon : MessageBox.Icon.ERROR,
						title : "Error"
					});
				});
		}
	});
});
