sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast"],(e,o)=>{"use strict";return e.extend("sapui5.walkthrough.main.controller.HelloPanel",{onShowHello(){const e=this.getView().getModel("i18n").getResourceBundle();const t=this.getView().getModel().getProperty("/recipient/name");const l=e.getText("helloMsg",[t]);o.show(l)},async onOpenDialog(){this.oDialog??=await this.loadFragment({name:"sapui5.walkthrough.main.view.HelloDialog"});this.oDialog.open()},onCloseDialog(){this.byId("helloDialog").close()}})});
//# sourceMappingURL=HelloPanel.controller.js.map