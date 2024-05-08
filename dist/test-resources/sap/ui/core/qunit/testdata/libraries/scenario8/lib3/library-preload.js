sap.ui.predefine("testlibs/scenario8/lib3/library",[
	"sap/ui/core/Lib",
	"sap/ui/core/library"
], function(Library) {
	"use strict";
	return Library.init({
		name: "testlibs.scenario8.lib3",
		dependencies: [
		],
		noLibraryCSS: true
	});
});
sap.ui.require.preload({
	"testlibs/scenario8/lib3/manifest.json":"{\n\t\"sap.ui5\": {\n\t\t\"dependencies\": {\n\t\t\t\"libs\": {}\n\t\t}\n\t}\n}"
});