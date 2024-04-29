sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("sapui5.walkthrough.main.controller.InvoiceList", {
      onInit() {
        const oViewModel = new JSONModel({
          currency: "USD",
        });
        this.getView().setModel(oViewModel, "view");
      },
    });
  }
);
