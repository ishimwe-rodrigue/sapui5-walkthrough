sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
  ],
  (Controller, JSONModel, formatter,  Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("sapui5.walkthrough.main.controller.InvoiceList", {
      formatter: formatter,
      onInit() {
        const oViewModel = new JSONModel({
          currency: "USD",
        });
        this.getView().setModel(oViewModel, "view");
      },

      onFilterInvoices(oEvent) {

        //build filter array
        const aFilter = [];
        const sQuery = oEvent.getParameter("query");
        
        if(sQuery) {
            aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
        }

      //   if (sQuery) {
      //     const sLowerCaseQuery = sQuery.toLowerCase(); // Convert query to lowercase
      //     aFilter.push(new Filter("ProductName", FilterOperator.Contains, sLowerCaseQuery));
      // }

        //filter binding
        const oList = this.byId("invoiceList");
        const oBinding = oList.getBinding("items");
        oBinding.filter(aFilter)
      },
      onPress(oEvent) {
        const oItem = oEvent.getSource();
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("detail", {
          invoicePath: window.encodeURIComponent(oItem.getBindingContext("invoice").getPath().substr(1))
        });
      }
    });
  }
);
