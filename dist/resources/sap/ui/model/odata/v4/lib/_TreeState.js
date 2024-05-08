/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_Helper"],function(e){"use strict";class t{mPredicate2ExpandLevels={};mPredicate2OutOfPlace={};constructor(e,t){this.fnGetKeyFilter=t;this.sNodeProperty=e}collapse(t){if(!this.sNodeProperty){return}const i=e.getPrivateAnnotation(t,"predicate");const r=this.mPredicate2ExpandLevels[i];if(r&&r.Levels){delete this.mPredicate2ExpandLevels[i]}else{const r=e.drillDown(t,this.sNodeProperty);this.mPredicate2ExpandLevels[i]={NodeID:r,Levels:0}}}delete(t){if(!this.sNodeProperty){return}const i=e.getPrivateAnnotation(t,"predicate");delete this.mPredicate2ExpandLevels[i];this.deleteOutOfPlace(i);e.getPrivateAnnotation(t,"spliced",[]).forEach(e=>{this.delete(e)})}deleteOutOfPlace(e){delete this.mPredicate2OutOfPlace[e];Object.values(this.mPredicate2OutOfPlace).forEach(t=>{if(t.parentPredicate===e){this.deleteOutOfPlace(t.nodePredicate)}})}expand(t){if(!this.sNodeProperty){return}const i=e.getPrivateAnnotation(t,"predicate");const r=this.mPredicate2ExpandLevels[i];if(r&&!r.Levels){delete this.mPredicate2ExpandLevels[i]}else{const r=e.drillDown(t,this.sNodeProperty);this.mPredicate2ExpandLevels[i]={NodeID:r,Levels:1}}}getExpandLevels(){const e=Object.values(this.mPredicate2ExpandLevels);return e.length?JSON.stringify(e):undefined}getOutOfPlace(e){return this.mPredicate2OutOfPlace[e]}getOutOfPlaceCount(){return this.getOutOfPlacePredicates().length}getOutOfPlaceGroupedByParent(){const e={};for(const t of Object.values(this.mPredicate2OutOfPlace)){const i=t.parentPredicate;const r=e[i]??={nodeFilters:[],nodePredicates:[],parentFilter:t.parentFilter,parentPredicate:i};r.nodeFilters.push(t.nodeFilter);r.nodePredicates.push(t.nodePredicate)}return Object.values(e)}getOutOfPlacePredicates(){return Object.keys(this.mPredicate2OutOfPlace)}reset(){this.mPredicate2ExpandLevels={};this.mPredicate2OutOfPlace={}}setOutOfPlace(t,i){const r={nodeFilter:this.fnGetKeyFilter(t),nodePredicate:e.getPrivateAnnotation(t,"predicate")};if(i){r.parentFilter=this.fnGetKeyFilter(i);r.parentPredicate=e.getPrivateAnnotation(i,"predicate")}this.mPredicate2OutOfPlace[r.nodePredicate]=r}}return t});
//# sourceMappingURL=_TreeState.js.map