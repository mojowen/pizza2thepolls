System.register(["./p-a43e70fd.system.js","./p-5946b29d.system.js"],(function(t){"use strict";var e,i,n;return{setters:[function(t){e=t.r;i=t.g},function(t){n=t.A}],execute:function(){var r=t("stencil_route_title",function(){function t(t){e(this,t);this.titleSuffix="";this.pageTitle=""}t.prototype.updateDocumentTitle=function(){var t=this.el;if(t.ownerDocument){t.ownerDocument.title=""+this.pageTitle+(this.titleSuffix||"")}};t.prototype.componentWillLoad=function(){this.updateDocumentTitle()};Object.defineProperty(t.prototype,"el",{get:function(){return i(this)},enumerable:false,configurable:true});Object.defineProperty(t,"watchers",{get:function(){return{pageTitle:["updateDocumentTitle"]}},enumerable:false,configurable:true});return t}());n.injectProps(r,["titleSuffix"])}}}));