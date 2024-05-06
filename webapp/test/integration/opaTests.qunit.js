QUnit.config.autostart = false;

sap.ui.require(["sap/ui/core/Core"], async(Core) => {
	"use strict";

	await Core.ready();

	sap.ui.require([
        "sapui5/walkthrough/main/localService/mockserver",
        "sapui5/walkthrough/main/test/integration/NavigationJourney"
	], (mockserver) => {
        // initialize the mock server
        mockserver.init();
        QUnit.start();
	});
});