"use strict";var precacheConfig=[["/index.html","4d55f88ee54b0ef579d33cad518d087c"],["/static/css/main.46f8cb62.css","257461897701d507d794c836eca599ce"],["/static/media/addItem.be7b05dc.png","be7b05dc417bf70cd40fd4293b84be26"],["/static/media/collapse.a1249c16.png","a1249c16e7b11a9cb15ff021dcbeb17e"],["/static/media/color-picker-close.0d8934b5.png","0d8934b5c8cbe28c2f64bdf5bf106fad"],["/static/media/color-picker.5ea115d3.png","5ea115d35092b65246b12c1ecefc1c70"],["/static/media/deleteX.4366e312.png","4366e31236dece0858ed52d144f6801a"],["/static/media/edit.0dd83694.png","0dd83694c7da1c2e85382ec7561e7112"],["/static/media/fontSizeDOWN.81c507c4.png","81c507c45927e4d49c8ccb84f55bdbb0"],["/static/media/fontSizeUP.26ce9441.png","26ce9441f015f9de3af7c3f87c06d42d"],["/static/media/left-arrow.fea68fec.png","fea68fec4b85532de6dea787cf6bd76b"],["/static/media/lock.7f2020f4.png","7f2020f4dbb9b255d6c7e80dc9ae22ad"],["/static/media/off.eb7d5ef7.png","eb7d5ef742dcf9eb12c9b8aeaacc5f95"],["/static/media/on.51316ca6.png","51316ca6ccce67eebc6734f0b6bc883e"],["/static/media/open-all.51323985.png","5132398571404a2b6c26ca627c23e472"],["/static/media/right-arrow.2f280b36.png","2f280b36d70720e968a74e9c20bf19a0"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,n,a){var c=new URL(e);return a&&c.pathname.match(a)||(c.search+=(c.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),c.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return n.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],a=new URL(t,self.location),c=createCacheKey(a,hashParamName,n,/\.\w{8}\./);return[a.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(a){return setOfCachedUrls(a).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return a.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!n.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,n=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),a="index.html";(e=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,a),e=urlsToCacheKeys.has(n));var c="/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(n=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(n)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});