sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
  ],
  (Controller, JSONModel, formatter) => {
    "use strict";

    return Controller.extend("sapui5.walkthrough.main.controller.InvoiceList", {
      formatter: formatter,
      onInit() {
        const oViewModel = new JSONModel({
          currency: "USD",
        });
        this.getView().setModel(oViewModel, "view");
      },
    });
  }
);
