sap.ui.define(["sap/ui/core/ComponentContainer"], (ComponentContainer) => {
  "use strict";

  new ComponentContainer({
    name: "sapui5.walkthrough.main",
    settings: {
      id: "walkthrough",
    },
    async: true,
  }).placeAt("content");
});
