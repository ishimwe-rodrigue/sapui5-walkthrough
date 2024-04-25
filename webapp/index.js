sap.ui.define([
	"sap/ui/core/mvc/XMLView"
], (XMLView) => {
	"use strict";

	XMLView.create({
		viewName: "sapui5.walkthrough.main.view.App"
	}).then((oView) => oView.placeAt("content"));
});
