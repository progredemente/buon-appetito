!function(){var n,e,t,r,o={352:function(n,e,t){Promise.all([t.e(822),t.e(450)]).then(t.bind(t,450))},536:function(n,e,t){"use strict";var r=new Error;n.exports=new Promise((function(n,e){if("undefined"!=typeof components)return n();t.l("/components/remoteEntry.js",(function(t){if("undefined"!=typeof components)return n();var o=t&&("load"===t.type?"missing":t.type),u=t&&t.target&&t.target.src;r.message="Loading script failed.\n("+o+": "+u+")",r.name="ScriptExternalLoadError",r.type=o,r.request=u,e(r)}),"components")})).then((function(){return components}))}},u={};function i(n){var e=u[n];if(void 0!==e)return e.exports;var t=u[n]={id:n,exports:{}};return o[n](t,t.exports,i),t.exports}i.m=o,i.c=u,i.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return i.d(e,{a:e}),e},i.d=function(n,e){for(var t in e)i.o(e,t)&&!i.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:e[t]})},i.f={},i.e=function(n){return Promise.all(Object.keys(i.f).reduce((function(e,t){return i.f[t](n,e),e}),[]))},i.u=function(n){return n+"."+{294:"58ba49fd507d5c75f76e",450:"822a0ec2307007fca579",822:"7e05c9cf6d46457a1f8b",935:"dad23614c3445cbc05e5"}[n]+".js"},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(n){if("object"==typeof window)return window}}(),i.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},n={},e="buon-appetito:",i.l=function(t,r,o,u){if(n[t])n[t].push(r);else{var f,c;if(void 0!==o)for(var a=document.getElementsByTagName("script"),s=0;s<a.length;s++){var l=a[s];if(l.getAttribute("src")==t||l.getAttribute("data-webpack")==e+o){f=l;break}}f||(c=!0,(f=document.createElement("script")).charset="utf-8",f.timeout=120,i.nc&&f.setAttribute("nonce",i.nc),f.setAttribute("data-webpack",e+o),f.src=t),n[t]=[r];var p=function(e,r){f.onerror=f.onload=null,clearTimeout(d);var o=n[t];if(delete n[t],f.parentNode&&f.parentNode.removeChild(f),o&&o.forEach((function(n){return n(r)})),e)return e(r)},d=setTimeout(p.bind(null,void 0,{type:"timeout",target:f}),12e4);f.onerror=p.bind(null,f.onerror),f.onload=p.bind(null,f.onload),c&&document.head.appendChild(f)}},i.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},t={450:[671]},r={671:["default","./Icon",536]},i.f.remotes=function(n,e){i.o(t,n)&&t[n].forEach((function(n){var t=i.R;t||(t=[]);var o=r[n];if(!(t.indexOf(o)>=0)){if(t.push(o),o.p)return e.push(o.p);var u=function(e){e||(e=new Error("Container missing")),"string"==typeof e.message&&(e.message+='\nwhile loading "'+o[1]+'" from '+o[2]),i.m[n]=function(){throw e},o.p=0},f=function(n,t,r,i,f,c){try{var a=n(t,r);if(!a||!a.then)return f(a,i,c);var s=a.then((function(n){return f(n,i)}),u);if(!c)return s;e.push(o.p=s)}catch(n){u(n)}},c=function(n,e,r){return f(e.get,o[1],t,0,a,r)},a=function(e){o.p=1,i.m[n]=function(n){n.exports=e()}};f(i,o[2],0,0,(function(n,e,t){return n?f(i.I,o[0],0,n,c,t):u()}),1)}}))},function(){i.S={};var n={},e={};i.I=function(t,r){r||(r=[]);var o=e[t];if(o||(o=e[t]={}),!(r.indexOf(o)>=0)){if(r.push(o),n[t])return n[t];i.o(i.S,t)||(i.S[t]={});var u=i.S[t],f="buon-appetito",c=function(n,e,t,r){var o=u[n]=u[n]||{},i=o[e];(!i||!i.loaded&&(!r!=!i.eager?r:f>i.from))&&(o[e]={get:t,from:f,eager:!!r})},a=[];return"default"===t&&(c("react-dom","18.2.0",(function(){return Promise.all([i.e(935),i.e(822)]).then((function(){return function(){return i(935)}}))})),c("react","18.2.0",(function(){return i.e(294).then((function(){return function(){return i(294)}}))})),function(n){var e=function(n){var e;e="Initialization of sharing external failed: "+n,"undefined"!=typeof console&&console.warn&&console.warn(e)};try{var o=i(536);if(!o)return;var u=function(n){return n&&n.init&&n.init(i.S[t],r)};if(o.then)return a.push(o.then(u,e));var f=u(o);if(f&&f.then)return a.push(f.catch(e))}catch(n){e(n)}}()),a.length?n[t]=Promise.all(a).then((function(){return n[t]=1})):n[t]=1}}}(),function(){var n;i.g.importScripts&&(n=i.g.location+"");var e=i.g.document;if(!n&&e&&(e.currentScript&&(n=e.currentScript.src),!n)){var t=e.getElementsByTagName("script");if(t.length)for(var r=t.length-1;r>-1&&!n;)n=t[r--].src}if(!n)throw new Error("Automatic publicPath is not supported in this browser");n=n.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=n}(),function(){var n=function(n){var e=function(n){return n.split(".").map((function(n){return+n==n?+n:n}))},t=/^([^-+]+)?(?:-([^+]+))?(?:\+(.+))?$/.exec(n),r=t[1]?e(t[1]):[];return t[2]&&(r.length++,r.push.apply(r,e(t[2]))),t[3]&&(r.push([]),r.push.apply(r,e(t[3]))),r},e=function(t,r){if(0 in t){r=n(r);var o=t[0],u=o<0;u&&(o=-o-1);for(var i=0,f=1,c=!0;;f++,i++){var a,s,l=f<t.length?(typeof t[f])[0]:"";if(i>=r.length||"o"==(s=(typeof(a=r[i]))[0]))return!c||("u"==l?f>o&&!u:""==l!=u);if("u"==s){if(!c||"u"!=l)return!1}else if(c)if(l==s)if(f<=o){if(a!=t[f])return!1}else{if(u?a>t[f]:a<t[f])return!1;a!=t[f]&&(c=!1)}else if("s"!=l&&"n"!=l){if(u||f<=o)return!1;c=!1,f--}else{if(f<=o||s<l!=u)return!1;c=!1}else"s"!=l&&"n"!=l&&(c=!1,f--)}}var p=[],d=p.pop.bind(p);for(i=1;i<t.length;i++){var h=t[i];p.push(1==h?d()|d():2==h?d()&d():h?e(h,r):!d())}return!!d()},t=function(t,r,o){var u=t[r];return(r=Object.keys(u).reduce((function(t,r){return!e(o,r)||t&&!function(e,t){e=n(e),t=n(t);for(var r=0;;){if(r>=e.length)return r<t.length&&"u"!=(typeof t[r])[0];var o=e[r],u=(typeof o)[0];if(r>=t.length)return"u"==u;var i=t[r],f=(typeof i)[0];if(u!=f)return"o"==u&&"n"==f||"s"==f||"u"==u;if("o"!=u&&"u"!=u&&o!=i)return o<i;r++}}(t,r)?t:r}),0))&&u[r]},r=function(n){return function(e,t,r,o){var u=i.I(e);return u&&u.then?u.then(n.bind(n,e,i.S[e],t,r,o)):n(e,i.S[e],t,r,o)}}((function(n,e,r,o,u){var f=e&&i.o(e,r)&&t(e,r,o);return f?function(n){return n.loaded=1,n.get()}(f):u()})),o={},u={822:function(){return r("default","react",[1,18,2,0],(function(){return i.e(294).then((function(){return function(){return i(294)}}))}))},468:function(){return r("default","react-dom",[1,18,2,0],(function(){return i.e(935).then((function(){return function(){return i(935)}}))}))}},f={450:[468],822:[822]};i.f.consumes=function(n,e){i.o(f,n)&&f[n].forEach((function(n){if(i.o(o,n))return e.push(o[n]);var t=function(e){o[n]=0,i.m[n]=function(t){delete i.c[n],t.exports=e()}},r=function(e){delete o[n],i.m[n]=function(t){throw delete i.c[n],e}};try{var f=u[n]();f.then?e.push(o[n]=f.then(t).catch(r)):t(f)}catch(n){r(n)}}))}}(),function(){var n={179:0};i.f.j=function(e,t){var r=i.o(n,e)?n[e]:void 0;if(0!==r)if(r)t.push(r[2]);else if(822!=e){var o=new Promise((function(t,o){r=n[e]=[t,o]}));t.push(r[2]=o);var u=i.p+i.u(e),f=new Error;i.l(u,(function(t){if(i.o(n,e)&&(0!==(r=n[e])&&(n[e]=void 0),r)){var o=t&&("load"===t.type?"missing":t.type),u=t&&t.target&&t.target.src;f.message="Loading chunk "+e+" failed.\n("+o+": "+u+")",f.name="ChunkLoadError",f.type=o,f.request=u,r[1](f)}}),"chunk-"+e,e)}else n[e]=0};var e=function(e,t){var r,o,u=t[0],f=t[1],c=t[2],a=0;if(u.some((function(e){return 0!==n[e]}))){for(r in f)i.o(f,r)&&(i.m[r]=f[r]);c&&c(i)}for(e&&e(t);a<u.length;a++)o=u[a],i.o(n,o)&&n[o]&&n[o][0](),n[o]=0},t=self.webpackChunkbuon_appetito=self.webpackChunkbuon_appetito||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))}(),i.nc=void 0,i(352)}();