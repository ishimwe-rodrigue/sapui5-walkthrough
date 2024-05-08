/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Lib","sap/ui/core/library","sap/ui/core/InvisibleText","./library","./StandardListItem","./Link","./MessageListItemRenderer"],function(e,t,i,r,s,n,a){"use strict";var o=t.MessageType;var p=r.ListType;var g=s.extend("sap.m.MessageListItem",{metadata:{library:"sap.m",properties:{activeTitle:{type:"boolean",group:"Misc",defaultValue:false},messageType:{type:"sap.ui.core.MessageType",group:"Appearance",defaultValue:o.Error}},aggregations:{link:{type:"sap.m.Link",group:"Misc",multiple:false},linkAriaDescribedBy:{type:"sap.ui.core.Control",group:"Misc",multiple:false}},events:{activeTitlePress:{}}},renderer:a});g.prototype.onBeforeRendering=function(){s.prototype.onBeforeRendering.apply(this,arguments);var e=this.getLink(),t;if(!e&&this.getActiveTitle()){e=new n({press:[this.fireActiveTitlePress,this]});this.setLink(e)}if(e&&!e.getAriaDescribedBy().length){t=this._getLinkAriaDescribedBy();e.setText(this.getTitle());e.addAriaDescribedBy(t.getId());this.setLinkAriaDescribedBy(t)}};g.prototype._getLinkAriaDescribedBy=function(){var t=e.getResourceBundleFor("sap.m").getText("MESSAGE_VIEW_LINK_FOCUS_TEXT_"+this.getMessageType().toUpperCase());return new i(this.getId()+"-link",{text:t})};g.prototype.onkeydown=function(e){if(this.getActiveTitle()&&e.altKey&&e.key==="Enter"){this.fireActiveTitlePress(this)}};g.prototype.getContentAnnouncement=function(e){var t=s.prototype.getContentAnnouncement.apply(this,arguments),i,r,n;if(this.getActiveTitle()){n=this.getMessageType().toUpperCase();i=e.getText("MESSAGE_LIST_ITEM_FOCUS_TEXT_LOCATION_"+n);r=this.getType()===p.Navigation?e.getText("MESSAGE_LIST_ITEM_FOCUS_TEXT_DESCRIPTION"):"";t+=". ".concat(i,". ",r)}return t};g.prototype.getTitleRef=function(){var e=this.getActiveTitle();var t=this.getDescription();if(e){return this.getDomRef().querySelector("a")}if(t){return this.getDomRef().querySelector(".sapMSLITitle")}return this.getDomRef().querySelector(".sapMSLITitleOnly")};return g});
//# sourceMappingURL=MessageListItem.js.map