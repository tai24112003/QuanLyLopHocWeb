import{y as j,x as M,a7 as x,s as S,w as n,av as U,a8 as v,c as A,X as D,t as X,j as d,N as q,Q as N,r as C,i as _}from"./index-CIGRQTfT.js";function P(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function z(t){return parseFloat(t)}function E(t){return j("MuiSkeleton",t)}M("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const I=["animation","className","component","height","style","variant","width"];let s=t=>t,m,g,b,w;const L=t=>{const{classes:e,variant:a,animation:r,hasChildren:i,width:l,height:o}=t;return N({root:["root",a,r,i&&"withChildren",i&&!l&&"fitContent",i&&!o&&"heightAuto"]},E,e)},O=x(m||(m=s`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),B=x(g||(g=s`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),F=S("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:a}=t;return[e.root,e[a.variant],a.animation!==!1&&e[a.animation],a.hasChildren&&e.withChildren,a.hasChildren&&!a.width&&e.fitContent,a.hasChildren&&!a.height&&e.heightAuto]}})(({theme:t,ownerState:e})=>{const a=P(t.shape.borderRadius)||"px",r=z(t.shape.borderRadius);return n({display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:U(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em"},e.variant==="text"&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${r}${a}/${Math.round(r/.6*10)/10}${a}`,"&:empty:before":{content:'"\\00a0"'}},e.variant==="circular"&&{borderRadius:"50%"},e.variant==="rounded"&&{borderRadius:(t.vars||t).shape.borderRadius},e.hasChildren&&{"& > *":{visibility:"hidden"}},e.hasChildren&&!e.width&&{maxWidth:"fit-content"},e.hasChildren&&!e.height&&{height:"auto"})},({ownerState:t})=>t.animation==="pulse"&&v(b||(b=s`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `),O),({ownerState:t,theme:e})=>t.animation==="wave"&&v(w||(w=s`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),B,(e.vars||e).palette.action.hover)),Z=A.forwardRef(function(e,a){const r=D({props:e,name:"MuiSkeleton"}),{animation:i="pulse",className:l,component:o="span",height:c,style:k,variant:y="text",width:R}=r,p=X(r,I),f=n({},r,{animation:i,component:o,variant:y,hasChildren:!!p.children}),$=L(f);return d.jsx(F,n({as:o,ref:a,className:q($.root,l),ownerState:f},p,{style:n({width:R,height:c},k)}))});var u={},H=_;Object.defineProperty(u,"__esModule",{value:!0});var K=u.default=void 0,T=H(C()),V=d;K=u.default=(0,T.default)((0,V.jsx)("path",{d:"M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"}),"MoreHoriz");var h={},W=_;Object.defineProperty(h,"__esModule",{value:!0});var Q=h.default=void 0,G=W(C()),J=d;Q=h.default=(0,G.default)((0,J.jsx)("path",{d:"m20 12-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z"}),"ArrowDownward");export{Z as S,Q as a,K as d};
