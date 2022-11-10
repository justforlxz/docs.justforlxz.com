"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[868],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>d});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),l=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=l(e.components);return n.createElement(c.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),f=l(r),d=o,m=f["".concat(c,".").concat(d)]||f[d]||s[d]||a;return r?n.createElement(m,i(i({ref:t},u),{},{components:r})):n.createElement(m,i({ref:t},u))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=f;var p={};for(var c in t)hasOwnProperty.call(t,c)&&(p[c]=t[c]);p.originalType=e,p.mdxType="string"==typeof e?e:o,i[1]=p;for(var l=2;l<a;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},6171:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>s,frontMatter:()=>a,metadata:()=>p,toc:()=>l});var n=r(7462),o=(r(7294),r(3905));const a={sidebar_position:0,title:"Qt \u5165\u95e8",slug:"/"},i=void 0,p={unversionedId:"preparation/index",id:"preparation/index",title:"Qt \u5165\u95e8",description:"\u672c\u7cfb\u5217\u6587\u7ae0\u662f Qt \u7684\u5165\u95e8\u6587\u7ae0\uff0c\u6211\u4f1a\u4ece\u9879\u76ee\u7684\u5b89\u88c5\u5f00\u59cb\u8bb2\u8d77\uff0c\u5e76\u4e14\u4f1a\u5e26\u6709\u4e00\u90e8\u5206\u7684 Qt \u6e90\u7801\u5206\u6790\u3002",source:"@site/docs/qt/00-preparation/index.md",sourceDirName:"00-preparation",slug:"/",permalink:"/qt/",draft:!1,editUrl:"https://github.com/justforlxz/docs.justforlxz.com/tree/master/docs/qt/00-preparation/index.md",tags:[],version:"current",sidebarPosition:0,frontMatter:{sidebar_position:0,title:"Qt \u5165\u95e8",slug:"/"},sidebar:"tutorialSidebar",previous:{title:"\u51c6\u5907\u5de5\u4f5c",permalink:"/qt/preparation/"},next:{title:"\u65b0\u5efa\u9879\u76ee",permalink:"/qt/preparation/Init Project"}},c={},l=[],u={toc:l};function s(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"\u672c\u7cfb\u5217\u6587\u7ae0\u662f Qt \u7684\u5165\u95e8\u6587\u7ae0\uff0c\u6211\u4f1a\u4ece\u9879\u76ee\u7684\u5b89\u88c5\u5f00\u59cb\u8bb2\u8d77\uff0c\u5e76\u4e14\u4f1a\u5e26\u6709\u4e00\u90e8\u5206\u7684 Qt \u6e90\u7801\u5206\u6790\u3002"),(0,o.kt)("p",null,"\u901a\u8fc7\u672c\u7cfb\u5217\u7684\u6587\u7ae0\uff0c\u6211\u5e0c\u671b\u80fd\u6559\u4f1a\u5927\u5bb6\u4f7f\u7528 Qt \u5f00\u53d1\u56fe\u5f62\u5316\u8f6f\u4ef6\u3002"),(0,o.kt)("p",null,"\u672c\u7cfb\u5217\u6587\u7ae0\u5c06\u4f7f\u7528 Qt6 \u4f5c\u4e3a\u77e5\u8bc6\u8bb2\u89e3\uff0cQt5 \u548c Qt6 \u5728 API \u4e0a\u7684\u53d8\u5316\u4e0d\u662f\u7279\u522b\u5927\uff0c\u56e0\u4e3a\u6211\u4f7f\u7528\u7684 m1 mbp\uff0c\u65e0\u6cd5\u8fd0\u884c Qt5\uff0c\u4e3a\u4e86\u65b9\u4fbf\u5185\u5bb9\u7684\u51c6\u786e\u6027\uff0c\u6211\u5c06\u4f7f\u7528 Qt6 \u4f5c\u4e3a\u57fa\u7840\u7248\u672c\u3002"),(0,o.kt)("p",null,"\u867d\u7136\u6211\u5728\u4f7f\u7528 macOS\uff0c\u4f46\u662f Qt \u662f\u4e00\u4e2a\u8de8\u5e73\u53f0\u7684\u5e93\uff0c\u552f\u4e00\u6709\u533a\u522b\u7684\u5c31\u662f\u4e0d\u540c\u7cfb\u7edf\u7684\u5b89\u88c5\u65b9\u5f0f\uff0c\u6240\u4ee5\u6211\u4f1a\u5728\u672c\u7cfb\u5217\u4e2d\u540c\u6b65\u5c55\u793a\u4e0d\u540c\u7cfb\u7edf\u7684\u5b89\u88c5\u65b9\u6cd5\u548c\u8fc7\u7a0b\u3002"))}s.isMDXComponent=!0}}]);