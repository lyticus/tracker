!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("lyticus",[],e):"object"==typeof exports?exports.lyticus=e():t.lyticus=e()}(window,function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";function n(t,e){switch(t){case"segment":var r=function(t,r,n){e().track("".concat(t,"--").concat(r),n)};return{page:function(t){e().page(t)},track:r,addDocumentTracker:function(t,e){document.addEventListener(t,function(n){for(var o=n.target,u=0;u<e.length;u++){var a=e[u];if(o.matches(a)){var i=null,c=null;if(o.id&&(i=o.id),o.attributes){if(o.attributes.getNamedItem("data-track-ignore"))return;var f=o.attributes.getNamedItem("data-track-name");f&&(i=f.value);var d=o.attributes.getNamedItem("data-track-properties");d&&(c=d.value)}n&&r(t,i,c);break}}})}};default:throw new Error("Client not supported")}}r.r(e),r.d(e,"default",function(){return n})}])});