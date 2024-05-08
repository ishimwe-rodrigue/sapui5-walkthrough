//@ui5-bundle sapui5/walkthrough/main/Component-preload.js
sap.ui.require.preload({
	"sapui5/walkthrough/main/Component.js":function(){
sap.ui.define(["sap/ui/core/UIComponent","sap/ui/model/json/JSONModel","sap/ui/Device"],(e,t,i)=>{"use strict";return e.extend("sapui5.walkthrough.main.Component",{metadata:{interfaces:["sap.ui.core.IAsyncContentCreation"],manifest:"json"},init(){e.prototype.init.apply(this,arguments);const n={recipient:{name:"SAPUI5"}};const s=new t(n);this.setModel(s);const o=new t(i);o.setDefaultBindingMode("OneWay");this.setModel(o,"device");this.getRouter().initialize()},getContentDensityClass(){return i.support.touch?"sapUiSizeCozy":"sapUiSizeCompact"}})});
},
	"sapui5/walkthrough/main/control/ProductRating.js":function(){
sap.ui.define(["sap/ui/core/Control","sap/m/RatingIndicator","sap/m/Label","sap/m/Button"],(t,e,i,a)=>{"use strict";return t.extend("sapui5.walkthrough.main.control.ProductRating",{metadata:{properties:{value:{type:"float",defaultValue:0}},aggregations:{_rating:{type:"sap.m.RatingIndicator",multiple:false,visibility:"hidden"},_label:{type:"sap.m.Label",multiple:false,visibility:"hidden"},_button:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},events:{change:{parameters:{value:{type:"int"}}}}},init(){this.setAggregation("_rating",new e({value:this.getValue(),iconSize:"2rem",visualMode:"Half",liveChange:this._onRate.bind(this)}));this.setAggregation("_label",new i({text:"{i18n>productRatingLabelInitial}"}).addStyleClass("sapUiSmallMargin"));this.setAggregation("_button",new a({text:"{i18n>productRatingButton}",press:this._onSubmit.bind(this)}).addStyleClass("sapUiTinyMarginTopBottom"))},setValue(t){this.setProperty("value",t,true);this.getAggregation("_rating").setValue(t);return this},reset(){const t=this.getModel("i18n").getResourceBundle();this.setValue(0);this.getAggregation("_label").setDesign("Standard");this.getAggregation("_rating").setEnabled(true);this.getAggregation("_label").setText(t.getText("productRatingLabelInitial"));this.getAggregation("_button").setEnabled(true)},_onRate(t){const e=this.getModel("i18n").getResourceBundle();const i=t.getParameter("value");this.setProperty("value",i,true);this.getAggregation("_label").setText(e.getText("productRatingLabelIndicator",[i,t.getSource().getMaxValue()]));this.getAggregation("_label").setDesign("Bold")},_onSubmit(t){const e=this.getModel("i18n").getResourceBundle();this.getAggregation("_rating").setEnabled(false);this.getAggregation("_label").setText(e.getText("productRatingLabelFinal"));this.getAggregation("_button").setEnabled(false);this.fireEvent("change",{value:this.getValue()})},renderer(t,e){t.openStart("div",e);t.class("myAppDemoWTProductRating");t.openEnd();t.renderControl(e.getAggregation("_rating"));t.renderControl(e.getAggregation("_label"));t.renderControl(e.getAggregation("_button"));t.close("div")}})});
},
	"sapui5/walkthrough/main/controller/App.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],e=>{"use strict";return e.extend("sapui5.walkthrough.main.controller.App",{onInit(){this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())}})});
},
	"sapui5/walkthrough/main/controller/Detail.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History","sap/m/MessageToast","sap/ui/model/json/JSONModel"],(e,t,n,o)=>{"use strict";return e.extend("sapui5.walkthrough.main.controller.Detail",{onInit(){const e=new o({currency:"USD"});this.getView().setModel(e,"view");const t=this.getOwnerComponent().getRouter();t.getRoute("detail").attachPatternMatched(this.onObjectMatched,this)},onObjectMatched(e){this.getView().bindElement({path:"/"+window.decodeURIComponent(e.getParameter("arguments").invoicePath),model:"invoice"})},onNavBack(){const e=t.getInstance();const n=e.getPreviousHash();if(n!==undefined){window.history.go(-1)}else{const e=this.getOwnerComponent().getRouter();e.navTo("overview",{},true)}},onRatingChange(e){const t=e.getParameter("value");const o=this.getView().getModel("i18n").getResourceBundle();n.show(o.getText("ratingConfirmation",[t]))}})});
},
	"sapui5/walkthrough/main/controller/HelloPanel.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast"],(e,o)=>{"use strict";return e.extend("sapui5.walkthrough.main.controller.HelloPanel",{onShowHello(){const e=this.getView().getModel("i18n").getResourceBundle();const t=this.getView().getModel().getProperty("/recipient/name");const l=e.getText("helloMsg",[t]);o.show(l)},async onOpenDialog(){this.oDialog??=await this.loadFragment({name:"sapui5.walkthrough.main.view.HelloDialog"});this.oDialog.open()},onCloseDialog(){this.byId("helloDialog").close()}})});
},
	"sapui5/walkthrough/main/controller/InvoiceList.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","../model/formatter","sap/ui/model/Filter","sap/ui/model/FilterOperator"],(e,t,o,n,i)=>{"use strict";return e.extend("sapui5.walkthrough.main.controller.InvoiceList",{formatter:o,onInit(){const e=new t({currency:"USD"});this.getView().setModel(e,"view")},onFilterInvoices(e){const t=[];const o=e.getParameter("query");if(o){t.push(new n("ProductName",i.Contains,o))}const r=this.byId("invoiceList");const s=r.getBinding("items");s.filter(t)},onPress(e){const t=e.getSource();const o=this.getOwnerComponent().getRouter();o.navTo("detail",{invoicePath:window.encodeURIComponent(t.getBindingContext("invoice").getPath().substr(1))})}})});
},
	"sapui5/walkthrough/main/i18n/i18n.properties":'# App Descriptor\r\nappTitle=Hello World\r\nappDescription=A simple walkthrough app that explains the most important concepts of SAPUI5\r\n\r\n# Hello Panel\r\nshowHelloButtonText=Say Hello\r\nhelloMsg=Hello {0}\r\nhomePageTitle=Walkthrough\r\nhelloPanelTitle=Hello World\r\nopenDialogButtonText=Say Hello With Dialog\r\ndialogCloseButtonText=OK\r\n\r\n# Invoice List\r\ninvoiceListTitle=Invoices\r\ninvoiceStatusA=New\r\ninvoiceStatusB=In Progress\r\ninvoiceStatusC=Done\r\ncolumnQuantity=Quantity\r\ncolumnName=Name\r\ncolumnSupplier=Supplier\r\ncolumnStatus=Status\r\ncolumnPrice=Price\r\n\r\n# Detail Page\r\ndetailPageTitle=Walkthrough - Details\r\nratingConfirmation=You have rated this product with {0} stars\r\ndateTitle=Order date\r\nquantityTitle=Quantity\r\n\r\n# Product Rating\r\nproductRatingLabelInitial=Please rate this product\r\nproductRatingLabelIndicator=Your rating: {0} out of {1}\r\nproductRatingLabelFinal=Thank you for your rating!\r\nproductRatingButton=Rate',
	"sapui5/walkthrough/main/index.js":function(){
sap.ui.define(["sap/ui/core/ComponentContainer"],e=>{"use strict";new e({name:"sapui5.walkthrough.main",settings:{id:"walkthrough"},async:true}).placeAt("content")});
},
	"sapui5/walkthrough/main/localService/mockserver.js":function(){
sap.ui.define(["sap/ui/core/util/MockServer","sap/base/util/UriParameters"],function(e,t){"use strict";return{init:function(){var r=new e({rootUri:"https://services.odata.org/V2/Northwind/Northwind.svc/"});var a=new t(window.location.href);e.config({autoRespond:true,autoRespondAfter:a.get("serverDelay")||500});var i="../localService";r.simulate(i+"/metadata.xml",i+"/mockdata");r.start()}}});
},
	"sapui5/walkthrough/main/manifest.json":'{"_version":"1.58.0","sap.app":{"id":"sapui5.walkthrough.main","type":"application","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"dataSources":{"invoiceRemote":{"uri":"V2/Northwind/Northwind.svc/","type":"OData","settings":{"odataVersion":"2.0"}}}},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"dependencies":{"minUI5Version":"1.108.0","libs":{"sap.ui.core":{},"sap.m":{}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sapui5.walkthrough.main.i18n.i18n","supportedLocales":[""],"fallbackLocale":""}},"invoice":{"dataSource":"invoiceRemote"}},"rootView":{"viewName":"sapui5.walkthrough.main.view.App","type":"XML","id":"app"},"resources":{"css":[{"uri":"css/styles.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","type":"View","viewType":"XML","path":"sapui5.walkthrough.main.view","controlId":"app","controlAggregation":"pages"},"routes":[{"pattern":"","name":"overview","target":"overview"},{"pattern":"detail/{invoicePath}","name":"detail","target":"detail"}],"targets":{"overview":{"id":"overview","name":"Overview"},"detail":{"id":"detail","name":"Detail"}}},"contentDensities":{"compact":true,"cozy":true}}}',
	"sapui5/walkthrough/main/model/formatter.js":function(){
sap.ui.define([],()=>{"use strict";return{statusText(e){const t=this.getOwnerComponent().getModel("i18n").getResourceBundle();switch(e){case"A":return t.getText("invoiceStatusA");case"B":return t.getText("invoiceStatusB");case"C":return t.getText("invoiceStatusC");default:return e}}}});
},
	"sapui5/walkthrough/main/view/App.view.xml":'<mvc:View\r\n\tcontrollerName="sapui5.walkthrough.main.controller.App"\r\n\txmlns="sap.m"\r\n\txmlns:mvc="sap.ui.core.mvc"\r\n\tdisplayBlock="true"><Shell><App class="myAppDemoWT" id="app"/></Shell></mvc:View>',
	"sapui5/walkthrough/main/view/Detail.view.xml":'<mvc:View\r\n    controllerName="sapui5.walkthrough.main.controller.Detail"\r\n    xmlns="sap.m"\r\n    xmlns:mvc="sap.ui.core.mvc"\r\n    xmlns:wt="sapui5.walkthrough.main.control"><Page\r\n        title="{i18n>detailPageTitle}"\r\n        showNavButton="true"\r\n        navButtonPress=".onNavBack"><ObjectHeader\r\n            responsive="true"\r\n            fullScreenOptimized="true"\r\n            number="{\r\n                parts: [\r\n                    \'invoice>ExtendedPrice\',\r\n                    \'view>/currency\'\r\n                ],\r\n                type: \'sap.ui.model.type.Currency\',\r\n                formatOptions: {\r\n                    showMeasure: false\r\n                }\r\n            }"\r\n            numberUnit="{view>/currency}"\r\n            intro="{invoice>ShipperName}"\r\n            title="{invoice>ProductName}"><attributes><ObjectAttribute\r\n                    title="{i18n>quantityTitle}"\r\n                    text="{invoice>Quantity}"/><ObjectAttribute\r\n                    title="{i18n>dateTitle}"\r\n                    text="{\r\n                        path: \'invoice>ShippedDate\',\r\n                        type: \'sap.ui.model.type.Date\',\r\n                        formatOptions: {\r\n                            style: \'long\',\r\n                            source: {\r\n                            pattern: \'yyyy-MM-ddTHH:mm:ss\'\r\n                            }\r\n                        }\r\n                    }"/></attributes></ObjectHeader><wt:ProductRating\r\n            id="rating"\r\n            class="sapUiSmallMarginBeginEnd"\r\n            change=".onRatingChange"/></Page></mvc:View>\r\n',
	"sapui5/walkthrough/main/view/HelloDialog.fragment.xml":'<core:FragmentDefinition\r\n    xmlns="sap.m"\r\n    xmlns:core="sap.ui.core"\r\n><Dialog\r\n        id="helloDialog"\r\n        title="Hello {/recipient/name}"\r\n    ><content><core:Icon\r\n                src="sap-icon://hello-world"\r\n                size="8rem"\r\n                class="sapUiMediumMargin"\r\n            /></content><beginButton><Button\r\n                text="{i18n>dialogCloseButtonText}"\r\n                press=".onCloseDialog"\r\n            /></beginButton></Dialog></core:FragmentDefinition>\r\n',
	"sapui5/walkthrough/main/view/HelloPanel.view.xml":'<mvc:View\r\n\tcontrollerName="sapui5.walkthrough.main.controller.HelloPanel"\r\n\txmlns="sap.m"\r\n\txmlns:mvc="sap.ui.core.mvc"><Panel\r\n\t\theaderText="{i18n>helloPanelTitle}"\r\n\t\tclass="sapUiResponsiveMargin"\r\n\t\twidth="auto"\r\n\t\texpandable="{device>/system/phone}"\r\n\t\texpanded="{= !${device>/system/phone} }"\r\n        accessibleRole="Region"\r\n        ><content><Button\r\n\t\t\t\tid="helloDialogButton"\r\n\t\t\t\ticon="sap-icon://world"\r\n\t\t\t\ttext="{i18n>openDialogButtonText}"\r\n\t\t\t\tpress=".onOpenDialog"\r\n\t\t\t\tclass="sapUiSmallMarginEnd sapUiVisibleOnlyOnDesktop"/><Button\r\n\t\t\t\ttext="{i18n>showHelloButtonText}"\r\n\t\t\t\tpress=".onShowHello"\r\n\t\t\t\tclass="myCustomButton"/><Input\r\n\t\t\t\tvalue="{/recipient/name}"\r\n\t\t\t\tvalueLiveUpdate="true"\r\n\t\t\t\twidth="60%"/><FormattedText\r\n\t\t\t\thtmlText="Hello {/recipient/name}"\r\n\t\t\t\tclass="sapUiSmallMargin sapThemeHighlight-asColor myCustomText"/></content></Panel></mvc:View>',
	"sapui5/walkthrough/main/view/InvoiceList.view.xml":'<mvc:View\r\n\tcontrollerName="sapui5.walkthrough.main.controller.InvoiceList"\r\n\txmlns="sap.m"\r\n\txmlns:mvc="sap.ui.core.mvc"><Panel accessibleRole="Region"><headerToolbar><Toolbar><Title text="{i18n>invoiceListTitle}" /><ToolbarSpacer /><SearchField\r\n\t\t\t\t\twidth="50%"\r\n\t\t\t\t\tsearch=".onFilterInvoices"/></Toolbar></headerToolbar><Table\r\n\t\tid="invoiceList"\r\n\t\tclass="sapUiResponsiveMargin"\r\n\t\twidth="auto"\r\n\t\titems="{\r\n\t\t\t\tpath : \'invoice>/Invoices\',\r\n\t\t\t\tsorter : {\r\n\t\t\t\t\tpath : \'ShipperName\',\r\n\t\t\t\t\tgroup : true\r\n\t\t\t\t}\r\n\t\t\t}"><columns><Column\r\n\t\t\t\thAlign="End"\r\n\t\t\t\tminScreenWidth="Small"\r\n\t\t\t\tdemandPopin="true"\r\n\t\t\t\twidth="5em"><Text text="{i18n>columnQuantity}" /></Column><Column><Text text="{i18n>columnName}" /></Column><Column\r\n\t\t\t\tminScreenWidth="Small"\r\n\t\t\t\tdemandPopin="true"><Text text="{i18n>columnStatus}" /></Column><Column\r\n\t\t\t\tminScreenWidth="Tablet"\r\n\t\t\t\tdemandPopin="false"><Text text="{i18n>columnSupplier}" /></Column><Column hAlign="End"><Text text="{i18n>columnPrice}" /></Column></columns><items><ColumnListItem\r\n\t\t\t\ttype="Navigation"\r\n\t\t\t\tpress=".onPress"><cells><ObjectNumber\r\n\t\t\t\t\t\tnumber="{invoice>Quantity}"\r\n\t\t\t\t\t\temphasized="false"/><ObjectIdentifier title="{invoice>ProductName}" /><Text\r\n\t\t\t\t\t\ttext="{\r\n\t\t\t\t\t\t\t\tparts: [\r\n\t\t\t\t\t\t\t\t\t\'invoice>Status\',\r\n\t\t\t\t\t\t\t\t\t\'i18n>invoiceStatusA\',\r\n\t\t\t\t\t\t\t\t\t\'i18n>invoiceStatusB\',\r\n\t\t\t\t\t\t\t\t\t\'i18n>invoiceStatusC\'\r\n\t\t\t\t\t\t\t\t],\r\n\t\t\t\t\t\t\t\tformatter: \'.formatter.statusText\'\r\n\t\t\t\t\t\t\t}"/><Text text="{invoice>ShipperName}" /><ObjectNumber\r\n\t\t\t\t\t\tnumber="{\r\n\t\t\t\t\t\t\t\tparts: [\r\n\t\t\t\t\t\t\t\t\t\'invoice>ExtendedPrice\',\r\n\t\t\t\t\t\t\t\t\t\'view>/currency\'\r\n\t\t\t\t\t\t\t\t],\r\n\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.Currency\',\r\n\t\t\t\t\t\t\t\tformatOptions: {\r\n\t\t\t\t\t\t\t\t\tshowMeasure: false\r\n\t\t\t\t\t\t\t\t}\r\n\t\t\t\t\t\t\t}"\r\n\t\t\t\t\t\tunit="{view>/currency}"\r\n\t\t\t\t\t\tstate="{= ${invoice>ExtendedPrice} > 50 ? \'Error\' : \'Success\' }"/></cells></ColumnListItem></items></Table></Panel></mvc:View>',
	"sapui5/walkthrough/main/view/Overview.view.xml":'<mvc:View\r\n\tcontrollerName="sapui5.walkthrough.main.controller.App"\r\n\txmlns="sap.m"\r\n\txmlns:mvc="sap.ui.core.mvc"\r\n\tdisplayBlock="true"><Page title="{i18n>homePageTitle}"><landmarkInfo><PageAccessibleLandmarkInfo\r\n\t\t\t\trootRole="Region"\r\n\t\t\t\trootLabel="{i18n>Overview_rootLabel}"\r\n\t\t\t\tcontentRole="Main"\r\n\t\t\t\tcontentLabel="{i18n>Overview_contentLabel}"\r\n\t\t\t\theaderRole="Banner"\r\n\t\t\t\theaderLabel="{i18n>Overview_headerLabel}"/></landmarkInfo><content><mvc:XMLView viewName="sapui5.walkthrough.main.view.HelloPanel"/><mvc:XMLView viewName="sapui5.walkthrough.main.view.InvoiceList"/></content></Page></mvc:View>'
});
//# sourceMappingURL=Component-preload.js.map
