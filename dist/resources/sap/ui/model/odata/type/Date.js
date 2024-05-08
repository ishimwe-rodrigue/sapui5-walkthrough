/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/util/extend","sap/ui/core/CalendarType","sap/ui/core/Lib","sap/ui/core/date/UI5Date","sap/ui/core/format/DateFormat","sap/ui/model/FormatException","sap/ui/model/ParseException","sap/ui/model/ValidateException","sap/ui/model/odata/type/ODataType"],function(t,e,a,r,n,o,i,s,l,u){"use strict";var p=/\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])/,f;function c(){if(!f){f=o.getDateInstance({calendarType:a.Gregorian,pattern:"yyyy-MM-dd",strictParsing:true,UTC:true})}return f}function g(e,a){var r;e.oConstraints=undefined;if(a){r=a.nullable;if(r===false||r==="false"){e.oConstraints={nullable:false}}else if(r!==undefined&&r!==true&&r!=="true"){t.warning("Illegal nullable: "+r,null,e.getName())}}}var d=u.extend("sap.ui.model.odata.type.Date",{constructor:function(t,e){u.apply(this,arguments);this.oFormatOptions=t;g(this,e)}});d.prototype._handleLocalizationChange=function(){this.oFormat=null};d.prototype.formatValue=function(t,e){var a;if(t===undefined||t===null){return null}switch(this.getPrimitiveType(e)){case"any":return t;case"object":return t instanceof Date?n.getInstance(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()):c().parse(t,false);case"string":a=t instanceof Date?t:c().parse(t);return a?this.getFormat().format(a):t;default:throw new i("Don't know how to format "+this.getName()+" to "+e)}};d.prototype._getErrorMessage=function(){var t=n.getInstance().getFullYear()+"-12-31";return r.getResourceBundleFor("sap.ui.core").getText("EnterDate",[this.formatValue(t,"string")])};d.prototype.getDateValue=function(t){return t?n.getInstance(t+"T00:00"):null};d.prototype.getFormat=function(){if(!this.oFormat){var t=e({strictParsing:true},this.oFormatOptions);t.UTC=true;this.oFormat=o.getDateInstance(t)}return this.oFormat};d.prototype.getISOStringFromModelValue=function(t){return t?t:null};d.prototype.getModelFormat=function(){return c()};d.prototype.getModelValue=function(t){var e;if(t===null){e=null}else{n.checkDate(t);e=n.getInstance(0);e.setUTCFullYear(t.getFullYear(),t.getMonth(),t.getDate());e=this.getModelFormat().format(e)}this.validateValue(e);return e};d.prototype.getModelValueFromISOString=function(t){return t?t:null};d.prototype.getName=function(){return"sap.ui.model.odata.type.Date"};d.prototype.parseValue=function(t,e){var a;if(t===""||t===null){return null}switch(this.getPrimitiveType(e)){case"object":return c().format(t,false);case"string":a=this.getFormat().parse(t);if(!a){throw new s(this._getErrorMessage())}return c().format(a);default:throw new s("Don't know how to parse "+this.getName()+" from "+e)}};d.prototype.validateValue=function(t){if(t===null){if(this.oConstraints&&this.oConstraints.nullable===false){throw new l(this._getErrorMessage())}}else if(typeof t!=="string"||!p.test(t)){throw new l("Illegal "+this.getName()+" value: "+t)}};d._resetModelFormatter=function(){f=undefined};return d});
//# sourceMappingURL=Date.js.map