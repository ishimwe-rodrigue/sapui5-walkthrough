/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_Batch","./_GroupLock","./_Helper","./_V2Requestor","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/core/cache/CacheManager","sap/ui/security/Security","sap/ui/thirdparty/jquery"],function(e,t,r,n,i,o,s,a,jQuery){"use strict";var u={Accept:"multipart/mixed"},c="sap.ui.model.odata.v4.optimisticBatch:",h="sap.ui.model.odata.v4.lib._Requestor",f="@com.sap.vocabularies.Common.v1.Messages",p=/(\$\w+)=~/g,d=/^\d+$/;function l(e){var t=Object.assign({},e);delete t["X-CSRF-Token"];return t}function m(e){var t;e=e.toLowerCase();for(t in this.headers){if(t.toLowerCase()===e){return this.headers[t]}}}function y(e,t,n,i,o){this.mBatchQueue={};this.bBatchSent=false;this.mHeaders=t||{};this.aLockedGroupLocks=[];this.oModelInterface=i;this.oOptimisticBatch=null;this.sQueryParams=r.buildQuery(n);this.mRunningChangeRequests={};this.iSessionTimer=0;this.iSerialNumber=0;this.sServiceUrl=e;this.vStatistics=n&&n["sap-statistics"];this.bWithCredentials=o;this.processSecurityTokenHandlers()}y.prototype.mFinalHeaders={"Content-Type":"application/json;charset=UTF-8;IEEE754Compatible=true"};y.prototype.mPredefinedPartHeaders={Accept:"application/json;odata.metadata=minimal;IEEE754Compatible=true"};y.prototype.mPredefinedRequestHeaders={Accept:"application/json;odata.metadata=minimal;IEEE754Compatible=true","OData-MaxVersion":"4.0","OData-Version":"4.0","X-CSRF-Token":"Fetch"};y.prototype.mReservedHeaders={accept:true,"accept-charset":true,"content-encoding":true,"content-id":true,"content-language":true,"content-length":true,"content-transfer-encoding":true,"content-type":true,"if-match":true,"if-none-match":true,isolation:true,"odata-isolation":true,"odata-maxversion":true,"odata-version":true,prefer:true,"sap-contextid":true};y.prototype.addChangeSet=function(e){var t=[],r=this.getOrCreateBatchQueue(e,true);t.iSerialNumber=this.getSerialNumber();r.iChangeSet+=1;r.splice(r.iChangeSet,0,t)};y.prototype.addChangeToGroup=function(e,t){var r;if(this.getGroupSubmitMode(t)==="Direct"){e.$resolve(this.request(e.method,e.url,this.lockGroup(t,this,true,true),e.headers,e.body,e.$submit,e.$cancel))}else{r=this.getOrCreateBatchQueue(t);r[r.iChangeSet].push(e)}};y.prototype.addQueryString=function(e,t,n){var i;n=this.convertQueryOptions(t,n,false,true);e=e.replace(p,function(e,t){var i=n[t];delete n[t];return r.encodePair(t,i)});i=r.buildQuery(n);if(!i){return e}return e+(e.includes("?")?"&"+i.slice(1):i)};y.prototype.batchRequestSent=function(e,t,r){var n,i;if(r){if(!(e in this.mRunningChangeRequests)){this.mRunningChangeRequests[e]=[]}n=new o(function(e){i=e});n.$resolve=i;n.$requests=t;this.mRunningChangeRequests[e].push(n)}};y.prototype.batchResponseReceived=function(e,t,r){var n;if(r){n=this.mRunningChangeRequests[e].filter(function(e){if(e.$requests===t){e.$resolve();return false}return true});if(n.length){this.mRunningChangeRequests[e]=n}else{delete this.mRunningChangeRequests[e]}}};y.prototype.buildQueryString=function(e,t,n,i){return r.buildQuery(this.convertQueryOptions(e,t,n,i))};y.prototype.cancelChanges=function(e,t){if(this.mRunningChangeRequests[e]){throw new Error("Cannot cancel the changes for group '"+e+"', the batch request is running")}this.cancelChangesByFilter(function(){return true},e,t);this.cancelGroupLocks(e)};y.prototype.cancelChangesByFilter=function(e,t,r){var n=false,i=this;function o(t){var o=i.mBatchQueue[t],s,a,u,c,h;for(h=o.length-1;h>=0;h-=1){if(Array.isArray(o[h])){a=o[h];for(c=a.length-1;c>=0;c-=1){s=a[c];if(s.$cancel&&e(s)){if(!s.$cancel(r)){u=new Error("Request canceled: "+s.method+" "+s.url+"; group: "+t);u.canceled=true;s.$reject(u);a.splice(c,1);n=true}}}}}}if(t){if(this.mBatchQueue[t]){o(t)}}else{for(t in this.mBatchQueue){o(t)}}return n};y.prototype.cancelGroupLocks=function(e){this.aLockedGroupLocks.forEach(function(t){if((!e||e===t.getGroupId())&&t.isModifying()&&t.isLocked()){t.cancel()}})};y.prototype.checkConflictingStrictRequest=function(e,t,r){function n(e,t){return r!==t&&e.some(i)}function i(e){return e.headers.Prefer==="handling=strict"}if(i(e)&&t.slice(0,t.iChangeSet+1).some(n)){throw new Error("All requests with strict handling must belong to the same change set")}};y.prototype.checkForOpenRequests=function(){var e=this;if(!r.isEmptyObject(this.mRunningChangeRequests)||Object.keys(this.mBatchQueue).some(function(t){return e.mBatchQueue[t].some(function(e){return Array.isArray(e)?e.length:true})})||this.aLockedGroupLocks.some(function(e){return e.isLocked()})){throw new Error("Unexpected open requests")}};y.prototype.checkHeaderNames=function(e){var t;for(t in e){if(this.mReservedHeaders[t.toLowerCase()]){throw new Error("Unsupported header: "+t)}}};y.prototype.cleanUpChangeSets=function(e){var t,n=false,i;function o(e){if(!s(e)){if(e.method==="DELETE"&&e.headers["If-Match"]&&e.headers["If-Match"]["@odata.etag"]&&t.find(function(t){return t.headers["If-Match"]===e.headers["If-Match"]})){e.headers["If-Match"]={"@odata.etag":"*"}}t.push(e)}}function s(e){if(e.method!=="PATCH"){return false}return t.some(function(t){if(t.method==="PATCH"&&t.headers["If-Match"]===e.headers["If-Match"]){r.merge(t.body,e.body);e.$resolve(t.$promise);t.$mergeRequests(e.$mergeRequests());return true}})}for(i=e.iChangeSet;i>=0;i-=1){t=[];e[i].forEach(o);if(t.length===0){e.splice(i,1)}else if(t.length===1&&this.isChangeSetOptional()){e[i]=t[0]}else{e[i]=t}n||=t.length>0}return n};y.prototype.clearSessionContext=function(e){if(e){this.oModelInterface.fireSessionTimeout()}delete this.mHeaders["SAP-ContextId"];if(this.iSessionTimer){clearInterval(this.iSessionTimer);this.iSessionTimer=0}};y.prototype.convertExpand=function(e,t){var r,n=[],i=this;if(!e||typeof e!=="object"){throw new Error("$expand must be a valid object")}r=Object.keys(e);if(t){r=r.sort()}r.forEach(function(r){var o=e[r];if(o&&typeof o==="object"){n.push(i.convertExpandOptions(r,o,t))}else{n.push(r)}});return n.join(",")};y.prototype.convertExpandOptions=function(e,t,r){var n=[];this.doConvertSystemQueryOptions(undefined,t,function(e,t){n.push(e+"="+t)},undefined,r);return n.length?e+"("+n.join(";")+")":e};y.prototype.convertQueryOptions=function(e,t,r,n){var i={};if(!t){return undefined}this.doConvertSystemQueryOptions(e,t,function(e,t){i[e]=t},r,n);return i};y.prototype.convertResourcePath=function(e){return e};y.prototype.destroy=function(){this.clearSessionContext()};y.prototype.doCheckVersionHeader=function(e,t,r){var n=e("OData-Version"),i=!n&&e("DataServiceVersion");if(i){throw new Error("Expected 'OData-Version' header with value '4.0' but received"+" 'DataServiceVersion' header with value '"+i+"' in response for "+this.sServiceUrl+t)}if(n==="4.0"||!n&&r){return}throw new Error("Expected 'OData-Version' header with value '4.0' but received value '"+n+"' in response for "+this.sServiceUrl+t)};y.prototype.doConvertResponse=function(e,t){return e};y.prototype.doConvertSystemQueryOptions=function(e,t,r,n,i){var o=this;Object.keys(t).forEach(function(e){var s=t[e];if(n&&e[0]==="$"){return}switch(e){case"$expand":if(s!=="~"){s=o.convertExpand(s,i)}break;case"$select":if(Array.isArray(s)){s=i?s.slice().sort().join(","):s.join(",")}break;default:}r(e,s)})};y.prototype.fetchType=function(e,t){var r=this;if(t in e){return o.resolve(e[t])}return this.fetchTypeForPath(t).then(function(n){var i,s=[];if(n){i=r.getModelInterface().fetchMetadata(t+"/"+f).getResult();if(i){n=Object.create(n);n[f]=i}e[t]=n;(n.$Key||[]).forEach(function(n){if(typeof n==="object"){n=n[Object.keys(n)[0]];s.push(r.fetchType(e,t+"/"+n.slice(0,n.lastIndexOf("/"))))}});return o.all(s).then(function(){return n})}})};y.prototype.fetchTypeForPath=function(e){return this.oModelInterface.fetchMetadata(e+"/")};y.prototype.formatPropertyAsLiteral=function(e,t){return r.formatLiteral(e,t.$Type)};y.prototype.getGroupSubmitMode=function(e){return this.oModelInterface.getGroupProperty(e,"submit")};y.prototype.getModelInterface=function(){return this.oModelInterface};y.prototype.getOrCreateBatchQueue=function(e,t){var r,n=this.mBatchQueue[e];if(!n){r=[];r.iSerialNumber=0;n=this.mBatchQueue[e]=[r];n.iChangeSet=0;if(!t){this.oModelInterface.onCreateGroup(e)}}return n};y.prototype.getPathAndAddQueryOptions=function(e,t,r){var n=[],i,o={},s,a=this;e=e.slice(1,-5);if(t.$Parameter){t.$Parameter.forEach(function(e){o[e.$Name]=e})}if(t.$kind==="Function"){for(i in r){s=o[i];if(s){if(s.$isCollection){throw new Error("Unsupported collection-valued parameter: "+i)}n.push(encodeURIComponent(i)+"="+encodeURIComponent(a.formatPropertyAsLiteral(r[i],s)))}}e+="("+n.join(",")+")"}else{for(i in r){if(!(i in o)){delete r[i]}}}return e};y.prototype.getSerialNumber=function(){this.iSerialNumber+=1;return this.iSerialNumber};y.prototype.getServiceUrl=function(){return this.sServiceUrl};y.prototype.getUnlockedAutoCopy=function(e){if(this.getGroupSubmitMode(e.getGroupId())!=="API"){return e.getUnlockedCopy()}return this.lockGroup("$auto",e.getOwner())};y.prototype.hasOnlyPatchesWithoutSideEffects=function(e){return this.getGroupSubmitMode(e)==="Auto"&&!!this.mBatchQueue[e]&&this.mBatchQueue[e].every(function(e){return Array.isArray(e)&&e.every(function(e){return e.method==="PATCH"&&e.headers.Prefer==="return=minimal"})})};y.prototype.hasChanges=function(e,t){var r=this.mBatchQueue[e];if(r){return r.some(function(e){return Array.isArray(e)&&e.some(function(e){return e.headers["If-Match"]===t})})}return false};y.prototype.hasPendingChanges=function(e){var t=this;function r(t){if(!e){return Object.keys(t)}return e in t?[e]:[]}return r(this.mRunningChangeRequests).length>0||this.aLockedGroupLocks.some(function(t){var r=t.getGroupId();return(e===undefined||r===e)&&t.isModifying()&&t.isLocked()&&!r.startsWith("$inactive.")})||r(this.mBatchQueue).some(function(e){return!e.startsWith("$inactive.")&&t.mBatchQueue[e].some(function(e){return Array.isArray(e)&&e.some(function(e){return e.$cancel})})})};y.prototype.isActionBodyOptional=function(){return false};y.prototype.isBatchSent=function(){return this.bBatchSent};y.prototype.isChangeSetOptional=function(){return true};y.prototype.mergeGetRequests=function(e){var t=[],n=this;function i(e){return e.$queryOptions&&t.some(function(t){if(t.$queryOptions&&e.url===t.url&&e.$owner===t.$owner){t.$queryOptions=r.clone(t.$queryOptions);r.aggregateExpandSelect(t.$queryOptions,e.$queryOptions);e.$resolve(t.$promise);if(t.$mergeRequests&&e.$mergeRequests){t.$mergeRequests(e.$mergeRequests())}return true}return false})}e.forEach(function(e){if(!i(e)){t.push(e)}});t.forEach(function(e){var t=e.$queryOptions;if(t){if(t.$expand&&!t.$select.length){t.$select=Object.keys(t.$expand).sort().slice(0,1)}e.url=n.addQueryString(e.url,e.$metaPath,t)}});t.iChangeSet=e.iChangeSet;return t};y.prototype.processBatch=function(e){var t,n=this.mBatchQueue[e]||[],i=this;function o(e){if(Array.isArray(e)){e.forEach(o)}else if(e.$submit){e.$submit()}}function s(e,t){if(Array.isArray(t)){t.forEach(s.bind(null,e))}else{t.$reject(e)}}function a(e,t){var n;e.forEach(function(e,o){var u,c,h,f=t[o];if(Array.isArray(f)){a(e,f)}else if(!f){u=new Error("HTTP request was not processed because the previous request failed");u.cause=n;u.$reported=true;s(u,e)}else if(f.status>=400){f.getResponseHeader=m;n=r.createError(f,"Communication error",e.url?i.sServiceUrl+e.url:undefined,e.$resourcePath);if(Array.isArray(e)){r.decomposeError(n,e,i.sServiceUrl).forEach(function(t,r){e[r].$reject(t)})}else{e.$reject(n)}}else{if(f.responseText){try{i.doCheckVersionHeader(m.bind(f),e.url,true);h=i.doConvertResponse(JSON.parse(f.responseText),e.$metaPath)}catch(t){e.$reject(t);return}}else{h=e.method==="GET"?null:{}}i.reportHeaderMessages(e.url,m.call(f,"sap-messages"));c=m.call(f,"ETag");if(c){h["@odata.etag"]=c}e.$resolve(h)}})}delete this.mBatchQueue[e];o(n);t=this.cleanUpChangeSets(n);if(n.length===0){return Promise.resolve()}this.bBatchSent=true;n=this.mergeGetRequests(n);this.batchRequestSent(e,n,t);return this.sendBatch(n,e).then(function(e){a(n,e)}).catch(function(e){var t=new Error("HTTP request was not processed because $batch failed");t.cause=e;s(t,n);throw e}).finally(function(){i.batchResponseReceived(e,n,t)})};y.prototype.ready=function(){return o.resolve()};y.prototype.lockGroup=function(e,r,n,i,o){var s;s=new t(e,r,n,i,this.getSerialNumber(),o);if(n){this.aLockedGroupLocks.push(s)}return s};y.prototype.processOptimisticBatch=function(e,t){var r,n,o=this.oOptimisticBatch,a,u=this;if(!o){return}a=this.oModelInterface.getOptimisticBatchEnabler();n=o.key;this.oOptimisticBatch=null;if(o.result){if(y.matchesOptimisticBatch(e,t,o.firstBatch.requests,o.firstBatch.groupId)){if(a){Promise.resolve(a(n)).then(async e=>{if(!e){await s.del(c+n);i.info("optimistic batch: disabled, batch payload deleted",n,h)}}).catch(u.oModelInterface.getReporter())}i.info("optimistic batch: success, response consumed",n,h);return o.result}i.warning("optimistic batch: mismatch, response skipped",n,h);s.del(c+n).catch(this.oModelInterface.getReporter())}if(a){r=e.some(function(e){return Array.isArray(e)||e.method!=="GET"});if(r){i.warning("optimistic batch: modifying batch not supported",n,h);return}Promise.resolve(a(n)).then(function(r){if(r){return s.set(c+n,{groupId:t,requests:e.map(function(e){return{headers:l(e.headers),method:"GET",url:e.url}})}).then(function(){i.info("optimistic batch: enabled, batch payload saved",n,h)})}i.info("optimistic batch: disabled",n,h)}).catch(u.oModelInterface.getReporter())}};y.prototype.processSecurityTokenHandlers=function(){var e=this;this.oSecurityTokenPromise=null;a.getSecurityTokenHandlers().some(function(t){var r=t(e.sServiceUrl);if(r!==undefined){e.oSecurityTokenPromise=r.then(function(t){e.checkHeaderNames(t);Object.assign(e.mHeaders,{"X-CSRF-Token":undefined},t);e.oSecurityTokenPromise=null}).catch(function(e){i.error("An error occurred within security token handler: "+t,e,h);throw e});return true}})};y.prototype.refreshSecurityToken=function(e){var t=this;if(!this.oSecurityTokenPromise){if(e!==this.mHeaders["X-CSRF-Token"]){return Promise.resolve()}this.oSecurityTokenPromise=new Promise(function(e,n){const i={method:"HEAD",headers:Object.assign({},t.mHeaders,{"X-CSRF-Token":"Fetch"})};if(t.bWithCredentials){i.xhrFields={withCredentials:true}}jQuery.ajax(t.sServiceUrl+t.sQueryParams,i).then(function(r,n,i){var o=i.getResponseHeader("X-CSRF-Token");if(o){t.mHeaders["X-CSRF-Token"]=o}else{delete t.mHeaders["X-CSRF-Token"]}t.oSecurityTokenPromise=null;e()},function(e){t.oSecurityTokenPromise=null;n(r.createError(e,"Could not refresh security token"))})})}return this.oSecurityTokenPromise};y.prototype.relocate=function(e,t,r){var n=this.mBatchQueue[e],i=this,o=n&&n[0].some(function(e,o){if(e.body===t){i.addChangeToGroup(e,r);n[0].splice(o,1);return true}});if(!o){throw new Error("Request not found in group '"+e+"'")}};y.prototype.relocateAll=function(e,t,r){var n=0,i=this.mBatchQueue[e],o=this;if(i){i[0].slice().forEach(function(e){if(!r||e.headers["If-Match"]===r){o.addChangeToGroup(e,t);i[0].splice(n,1)}else{n+=1}})}};y.prototype.removeChangeRequest=function(e){var t=this.cancelChangesByFilter(function(t){return t.$promise===e});if(!t){throw new Error("Cannot reset the changes, the batch request is running")}};y.prototype.removePost=function(e,t){var n=r.getPrivateAnnotation(t,"postBody"),i=this.cancelChangesByFilter(function(e){return e.body===n},e);if(!i){throw new Error("Cannot reset the changes, the batch request is running")}};y.prototype.reportHeaderMessages=function(e,t){if(t){this.oModelInterface.reportTransitionMessages(JSON.parse(t),e)}};y.prototype.request=function(e,t,r,n,i,o,s,a,u,c,h,f,p){var d,l,m=r&&r.getGroupId()||"$direct",y,g=Infinity,v,S=this;if(m==="$cached"){l=new Error("Unexpected request: "+e+" "+t);l.$cached=true;throw l}if(r&&r.isCanceled()){if(s){s()}l=new Error("Request already canceled");l.canceled=true;return Promise.reject(l)}if(r){r.unlock();g=r.getSerialNumber()}t=this.convertResourcePath(t);u??=t;if(this.getGroupSubmitMode(m)!=="Direct"){if(m==="$single"&&this.mBatchQueue[m]){throw new Error("Cannot add new request to already existing $single queue")}y=new Promise(function(r,l){var y=S.getOrCreateBatchQueue(m);v={method:e,url:t,headers:Object.assign({},S.mPredefinedPartHeaders,S.mHeaders,n,S.mFinalHeaders),body:i,$cancel:s,$mergeRequests:p,$metaPath:a,$owner:f,$queryOptions:h,$reject:l,$resolve:r,$resourcePath:u,$submit:o};if(e==="GET"){y.push(v)}else if(c){y[0].unshift(v)}else{d=y.iChangeSet;while(y[d].iSerialNumber>g){d-=1}S.checkConflictingStrictRequest(v,y,d);y[d].push(v)}if(m==="$single"){S.submitBatch("$single")}});v.$promise=y;return y}if(this.vStatistics!==undefined){h=Object.assign({"sap-statistics":this.vStatistics},h)}if(h){t=S.addQueryString(t,a,h)}if(o){o()}return this.sendRequest(e,t,Object.assign({},n,this.mFinalHeaders,e==="GET"?{"sap-cancel-on-close":"true"}:undefined),JSON.stringify(i),u).then(function(e){S.reportHeaderMessages(e.resourcePath,e.messages);return S.doConvertResponse(typeof e.body==="string"?JSON.parse(e.body):e.body,a)})};y.prototype.sendBatch=function(t,r){var n=e.serializeBatchRequest(t,this.getGroupSubmitMode(r)==="Auto"?"Group ID: "+r:"Group ID (API): "+r,this.oModelInterface.isIgnoreETag());return this.processOptimisticBatch(t,r)||this.sendRequest("POST","$batch"+this.sQueryParams,Object.assign(n.headers,u),n.body).then(function(t){if(t.messages!==null){throw new Error("Unexpected 'sap-messages' response header for batch request")}return e.deserializeBatchResponse(t.contentType,t.body)})};y.prototype.sendOptimisticBatch=function(){var e=window.location.href,t=this;s.get(c+e).then(function(r){var n={key:e};if(r){if(t.isBatchSent()){i.error("optimistic batch: #sendBatch called before optimistic batch "+"payload could be read",undefined,h);return}n.firstBatch=r;n.result=t.sendBatch(r.requests,r.groupId);i.info("optimistic batch: sent ",e,h)}t.oOptimisticBatch=n}).catch(this.oModelInterface.getReporter())};y.prototype.sendRequest=function(e,t,n,o,s){var a=this.sServiceUrl+t,u=this;return new Promise(function(c,f){function p(d){const l={contentType:n&&n["Content-Type"],data:o,headers:Object.assign({},u.mPredefinedRequestHeaders,u.mHeaders,r.resolveIfMatchHeader(n,u.oModelInterface.isIgnoreETag())),method:e};var m=u.mHeaders["X-CSRF-Token"];if(u.bWithCredentials){l.xhrFields={withCredentials:true}}return jQuery.ajax(a,l).then(function(r,n,i){var o=i.getResponseHeader("ETag"),s=i.getResponseHeader("X-CSRF-Token");try{u.doCheckVersionHeader(i.getResponseHeader,t,!r)}catch(e){f(e);return}if(s){u.mHeaders["X-CSRF-Token"]=s}u.setSessionContext(i.getResponseHeader("SAP-ContextId"),i.getResponseHeader("SAP-Http-Session-Timeout"));r||=e==="GET"?null:{};if(o&&typeof r==="object"){r["@odata.etag"]=o}c({body:r,contentType:i.getResponseHeader("Content-Type"),messages:i.getResponseHeader("sap-messages"),resourcePath:t})},function(e){var t=e.getResponseHeader("SAP-ContextId"),n=e.getResponseHeader("X-CSRF-Token"),o;if(!d&&e.status===403&&n&&n.toLowerCase()==="required"){u.refreshSecurityToken(m).then(function(){p(true)},f)}else{o="Communication error";if(t){u.setSessionContext(t,e.getResponseHeader("SAP-Http-Session-Timeout"))}else if(u.mHeaders["SAP-ContextId"]){o="Session not found on server";i.error(o,undefined,h);u.clearSessionContext(true)}f(r.createError(e,o,a,s))}})}if(u.oSecurityTokenPromise&&e!=="GET"){u.oSecurityTokenPromise.then(p)}else{p()}})};y.prototype.setSessionContext=function(e,t){var r=d.test(t)?parseInt(t):0,n=Date.now()+30*60*1e3,o=this;this.clearSessionContext();if(e){this.mHeaders["SAP-ContextId"]=e;if(r>=60){this.iSessionTimer=setInterval(function(){if(Date.now()>=n){o.clearSessionContext(true);return}const e={method:"HEAD",headers:{"SAP-ContextId":o.mHeaders["SAP-ContextId"]}};if(o.bWithCredentials){e.xhrFields={withCredentials:true}}jQuery.ajax(o.sServiceUrl+o.sQueryParams,e).fail(function(e){if(e.getResponseHeader("SAP-Err-Id")==="ICMENOSESSION"){i.error("Session not found on server",undefined,h);o.clearSessionContext(true)}})},(r-5)*1e3)}else if(t!==null){i.warning("Unsupported SAP-Http-Session-Timeout header",t,h)}}};y.prototype.submitBatch=function(e){var t,r,n=this;r=o.all(this.aLockedGroupLocks.map(function(t){return t.waitFor(e)}));t=r.isPending();if(t){i.info("submitBatch('"+e+"') is waiting for locks",null,h)}return r.then(function(){if(n.hasOnlyPatchesWithoutSideEffects(e)){t=true;i.info("submitBatch('"+e+"') is waiting for potential side effect requests",null,h);return new Promise(function(e){setTimeout(function(){e()},0)})}}).then(function(){if(t){i.info("submitBatch('"+e+"') continues",null,h)}n.aLockedGroupLocks=n.aLockedGroupLocks.filter(function(e){return e.isLocked()});return n.processBatch(e)})};y.prototype.waitForBatchResponseReceived=function(e){return o.resolve(this.mBatchQueue[e][0][0].$promise)};y.prototype.waitForRunningChangeRequests=function(e){var t=this.mRunningChangeRequests[e];if(t){return t.length>1?o.all(t):t[0]}return o.resolve()};y.matchesOptimisticBatch=function(e,t,n,i){return t===i&&e.length===n.length&&e.every(function(e,t){return e.url===n[t].url&&r.deepEqual(l(e.headers),n[t].headers)})};y.create=function(e,t,r,i,o,s){var a=new y(e,r,i,t,s);if(o==="2.0"){n(a)}return a};return y},false);
//# sourceMappingURL=_Requestor.js.map