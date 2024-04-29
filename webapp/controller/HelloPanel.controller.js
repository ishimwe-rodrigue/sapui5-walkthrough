sap.ui.define(
    ["sap/ui/core/mvc/Controller", "sap/m/MessageToast", ],
    (Controller, MessageToast) => {
      "use strict";
  
      return Controller.extend("sapui5.walkthrough.main.controller.HelloPanel", {
        onShowHello() {
          // read msg from i18n model
          const oBundle = this.getView().getModel("i18n").getResourceBundle();
          const sRecipient = this.getView()
            .getModel()
            .getProperty("/recipient/name");
          const sMsg = oBundle.getText("helloMsg", [sRecipient]);
  
          // show message
          MessageToast.show(sMsg);
        },

        

        async onOpenDialog() {
            this.oDialog ??= await this.loadFragment({
                name: "sapui5.walkthrough.main.view.HelloDialog"
            });

            this.oDialog.open()
        }
      });
    }
  );
  