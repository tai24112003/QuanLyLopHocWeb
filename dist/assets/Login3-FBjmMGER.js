import{u as L,ak as C,d as G,c as p,j as e,G as t,aU as j,h as d,B as n,D as x,T as i,ar as g,as as w,aV as b,at as c,an as R,K as H,aA as v,aH as M,aW as y}from"./index-CIGRQTfT.js";import{G as $,F as q,c as T,a as f,d as U,A as V,b as O,L as _,e as K}from"./AuthFooter-D1IvKN1T.js";import{d as Q,C as J}from"./VisibilityOff-XZuDOnGQ.js";import"./cloneDeep-Do3RY9nW.js";const N=({...o})=>{const r=L(),k=C(r.breakpoints.down("md")),I=G(s=>s.customization),[S,A]=p.useState(!0),B=async()=>{console.error("Login")},[l,D]=p.useState(!1),F=()=>{D(!l)},P=s=>{s.preventDefault()};return e.jsxs(e.Fragment,{children:[e.jsxs(t,{container:!0,direction:"column",justifyContent:"center",spacing:2,children:[e.jsx(t,{item:!0,xs:12,children:e.jsx(j,{children:e.jsxs(d,{disableElevation:!0,fullWidth:!0,onClick:B,size:"large",variant:"outlined",sx:{color:"grey.700",backgroundColor:r.palette.grey[50],borderColor:r.palette.grey[100]},children:[e.jsx(n,{sx:{mr:{xs:1,sm:2,width:20}},children:e.jsx("img",{src:$,alt:"google",width:16,height:16,style:{marginRight:k?8:16}})}),"Sign in with Google"]})})}),e.jsx(t,{item:!0,xs:12,children:e.jsxs(n,{sx:{alignItems:"center",display:"flex"},children:[e.jsx(x,{sx:{flexGrow:1},orientation:"horizontal"}),e.jsx(d,{variant:"outlined",sx:{cursor:"unset",m:2,py:.5,px:7,borderColor:`${r.palette.grey[100]} !important`,color:`${r.palette.grey[900]}!important`,fontWeight:500,borderRadius:`${I.borderRadius}px`},disableRipple:!0,disabled:!0,children:"OR"}),e.jsx(x,{sx:{flexGrow:1},orientation:"horizontal"})]})}),e.jsx(t,{item:!0,xs:12,container:!0,alignItems:"center",justifyContent:"center",children:e.jsx(n,{sx:{mb:2},children:e.jsx(i,{variant:"subtitle1",children:"Sign in with Email address"})})})]}),e.jsx(q,{initialValues:{email:"",password:"",submit:null},validationSchema:T().shape({email:f().email("Must be a valid email").max(255).required("Email is required"),password:f().max(255).required("Password is required")}),children:({errors:s,handleBlur:m,handleChange:u,handleSubmit:E,isSubmitting:W,touched:a,values:h})=>e.jsxs("form",{noValidate:!0,onSubmit:E,...o,children:[e.jsxs(g,{fullWidth:!0,error:!!(a.email&&s.email),sx:{...r.typography.customInput},children:[e.jsx(w,{htmlFor:"outlined-adornment-email-login",children:"Email Address / Username"}),e.jsx(b,{id:"outlined-adornment-email-login",type:"email",value:h.email,name:"email",onBlur:m,onChange:u,label:"Email Address / Username",inputProps:{}}),a.email&&s.email&&e.jsx(c,{error:!0,id:"standard-weight-helper-text-email-login",children:s.email})]}),e.jsxs(g,{fullWidth:!0,error:!!(a.password&&s.password),sx:{...r.typography.customInput},children:[e.jsx(w,{htmlFor:"outlined-adornment-password-login",children:"Password"}),e.jsx(b,{id:"outlined-adornment-password-login",type:l?"text":"password",value:h.password,name:"password",onBlur:m,onChange:u,endAdornment:e.jsx(R,{position:"end",children:e.jsx(H,{"aria-label":"toggle password visibility",onClick:F,onMouseDown:P,edge:"end",size:"large",children:l?e.jsx(U,{}):e.jsx(Q,{})})}),label:"Password",inputProps:{}}),a.password&&s.password&&e.jsx(c,{error:!0,id:"standard-weight-helper-text-password-login",children:s.password})]}),e.jsxs(v,{direction:"row",alignItems:"center",justifyContent:"space-between",spacing:1,children:[e.jsx(M,{control:e.jsx(J,{checked:S,onChange:z=>A(z.target.checked),name:"checked",color:"primary"}),label:"Remember me"}),e.jsx(i,{variant:"subtitle1",color:"secondary",sx:{textDecoration:"none",cursor:"pointer"},children:"Forgot Password?"})]}),s.submit&&e.jsx(n,{sx:{mt:3},children:e.jsx(c,{error:!0,children:s.submit})}),e.jsx(n,{sx:{mt:2},children:e.jsx(j,{children:e.jsx(d,{disableElevation:!0,disabled:W,fullWidth:!0,size:"large",type:"submit",variant:"contained",color:"secondary",children:"Sign in"})})})]})})]})},te=()=>{const o=C(r=>r.breakpoints.down("md"));return e.jsx(V,{children:e.jsxs(t,{container:!0,direction:"column",justifyContent:"flex-end",sx:{minHeight:"100vh"},children:[e.jsx(t,{item:!0,xs:12,children:e.jsx(t,{container:!0,justifyContent:"center",alignItems:"center",sx:{minHeight:"calc(100vh - 68px)"},children:e.jsx(t,{item:!0,sx:{m:{xs:1,sm:3},mb:0},children:e.jsx(O,{children:e.jsxs(t,{container:!0,spacing:2,alignItems:"center",justifyContent:"center",children:[e.jsx(t,{item:!0,sx:{mb:3},children:e.jsx(y,{to:"#","aria-label":"logo",children:e.jsx(_,{})})}),e.jsx(t,{item:!0,xs:12,children:e.jsx(t,{container:!0,direction:{xs:"column-reverse",md:"row"},alignItems:"center",justifyContent:"center",children:e.jsx(t,{item:!0,children:e.jsxs(v,{alignItems:"center",justifyContent:"center",spacing:1,children:[e.jsx(i,{color:"secondary.main",gutterBottom:!0,variant:o?"h3":"h2",children:"Hi, Welcome Back"}),e.jsx(i,{variant:"caption",fontSize:"16px",textAlign:{xs:"center",md:"inherit"},children:"Enter your credentials to continue"})]})})})}),e.jsx(t,{item:!0,xs:12,children:e.jsx(N,{})}),e.jsx(t,{item:!0,xs:12,children:e.jsx(x,{})}),e.jsx(t,{item:!0,xs:12,children:e.jsx(t,{item:!0,container:!0,direction:"column",alignItems:"center",xs:12,children:e.jsx(i,{component:y,to:"/pages/register/register3",variant:"subtitle1",sx:{textDecoration:"none"},children:"Don't have an account?"})})})]})})})})}),e.jsx(t,{item:!0,xs:12,sx:{m:3,mt:1},children:e.jsx(K,{})})]})})};export{te as default};
