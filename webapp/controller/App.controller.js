sap.ui.define([
    "sap/ui/core/mvc/Controller"
 ], (Controller) => {
    "use strict";
 
    return Controller.extend("sapui5.walkthrough.main.controller.App", {
       onShowHello() {
          // show a native JavaScript alert
          alert("Hello World");
       }
    });
 });