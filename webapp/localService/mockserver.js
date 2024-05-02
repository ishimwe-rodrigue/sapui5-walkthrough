sap.ui.define([
    "sap/ui/core/util/MockServer",
    "sap/base/util/UriParameters"
], function (MockServer, UriParameters) {
    "use strict";

    return {
        init: function () {
            // create 
            var oMockServer = new MockServer({
                rootUri: "https://services.odata.org/V2/Northwind/Northwind.svc/"
            });

            var oUriParameters = new UriParameters(window.location.href);

            // configure mock server with a delay
            MockServer.config({
                autoRespond: true,
                autoRespondAfter: oUriParameters.get("serverDelay") || 500
            });

            // simulate
            var sPath = "../localService";
            oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");

            // start
            oMockServer.start();
        }
    }
})
// sap.ui.define([
// 	"sap/ui/core/util/MockServer"
// ], (MockServer) => {
// 	"use strict";

// 	return {
// 		init() {
// 			// create
// 			const oMockServer = new MockServer({
// 				rootUri: sap.ui.require.toUrl("sapui5/walkthrough/main") + "/https://services.odata.org/V2/Northwind/Northwind.svc/"
// 			});

// 			const oUrlParams = new URLSearchParams(window.location.search);

// 			// configure mock server with a delay
// 			MockServer.config({
// 				autoRespond: true,
// 				autoRespondAfter: oUrlParams.get("serverDelay") || 500
// 			});

// 			// simulate
// 			const sPath = sap.ui.require.toUrl("sapui5/walkthrough/main/localService");
// 			oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");

// 			// start
// 			oMockServer.start();
// 		}
// 	};
// });
