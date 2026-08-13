var b=Object.defineProperty;var v=(t,n,e)=>n in t?b(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var m=(t,n,e)=>v(t,typeof n!="symbol"?n+"":n,e);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&r(u)}).observe(document,{childList:!0,subtree:!0});function e(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=e(o);fetch(o.href,s)}})();class x extends HTMLElement{constructor(){super();m(this,"debugColumns",null);m(this,"toggleButton",null);m(this,"STORAGE_KEY","cleacss-grid-visibility");this.attachShadow({mode:"open"})}connectedCallback(){this.render(),this.setupEventListeners();const e=this.getStoredVisibility();this.toggleGridVisibility(e)}disconnectedCallback(){var e;(e=this.toggleButton)==null||e.removeEventListener("click",this.handleToggleClick)}render(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 100vh;
          z-index: 998;
          pointer-events: none; /* Allow clicks to pass through to elements below */
        }

        .grid-columns-debug {
         display: grid;
          grid-template-columns:
            [full-start] minmax(var(--grid-margin-min), var(--grid-margin-max)) [content-start] repeat(12, minmax(0, 1fr)) [content-end] minmax(var(--grid-margin-min), var(--grid-margin-max)) [full-end];
          row-gap: var(--grid-gap-y);
          column-gap: var(--grid-gap-x);
          height: 100vh;
          background: rgba(255, 255, 255, 0.2);
        }

        .grid-columns-debug > span {
          border-inline: 1px dashed rgba(153, 153, 153, 0.8);
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          font-weight: bold;
          position: relative;
        }

        .grid-columns-debug > span::after {
          content: attr(data-col);
          position: absolute;
          top: 32px; /* Change from bottom to top for better visibility */
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.7);
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Toggle button for grid overlay */
        .grid-overlay-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #333;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          font-family: sans-serif;
          cursor: pointer;
          z-index: 1001;
          pointer-events: auto; /* Make button clickable */
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: background-color 0.2s;
        }

        .grid-overlay-toggle:hover {
          background: #555;
        }
      </style>
      <div class="grid-columns-debug">
        ${this.generateColumnSpans()}
      </div>
    `,this.toggleButton=this.createButton(),this.shadowRoot.appendChild(this.toggleButton),this.debugColumns=this.shadowRoot.querySelector(".grid-columns-debug"))}generateColumnSpans(){return Array.from({length:14},(e,r)=>`<span data-col="${r>0&&r<13?r:"—"}"></span>`).join("")}createButton(){const e=document.createElement("button");return e.classList.add("grid-overlay-toggle"),e.textContent="Show Grid",e}setupEventListeners(){var e;this.handleToggleClick=this.handleToggleClick.bind(this),(e=this.toggleButton)==null||e.addEventListener("click",this.handleToggleClick)}handleToggleClick(){var r;const e=((r=this.debugColumns)==null?void 0:r.style.display)!=="none";this.toggleGridVisibility(!e)}toggleGridVisibility(e){!this.debugColumns||!this.toggleButton||(this.debugColumns.style.display=e?"grid":"none",this.toggleButton.textContent=e?"Hide Grid":"Show Grid",this.saveVisibilityState(e),e?document.body.classList.add("grid-overlay"):document.body.classList.remove("grid-overlay"))}getStoredVisibility(){try{return sessionStorage.getItem(this.STORAGE_KEY)==="true"}catch{return!1}}saveVisibilityState(e){try{sessionStorage.setItem(this.STORAGE_KEY,e.toString())}catch{}}}customElements.define("grid-visualizer",x);const h=document.createElement("canvas").getContext("2d"),E=()=>{const t=[0,50,100,200,300,400,500,600,700,800,900,1e3],n=document.getElementById("swatches"),e=document.getElementById("hue-input"),r=document.getElementById("chroma-input"),o=document.getElementById("hue-value"),s=document.getElementById("chroma-value");if(n===null||e===null||r===null||o===null||s===null)return;t.forEach(a=>{const i=document.createElement("div");i.className="flow has-items-center has-gap-2xs has-w-auto";const d=document.createElement("div");d.className=`swatch has-background-neutral-${a}`,a===0&&(d.style.border="1px solid var(--color-neutral-200)");const l=document.createElement("span");l.className="swatch-label",l.textContent=`${a}`;const g=document.createElement("code");g.className="swatch-label",g.id=`hex-${a}`,i.appendChild(d),i.appendChild(l),i.appendChild(g),n.appendChild(i)});function u(a){if(!h)return"";h.fillStyle=a,h.fillRect(0,0,1,1);const[i,d,l]=h.getImageData(0,0,1,1).data;return"#"+[i,d,l].map(g=>g.toString(16).padStart(2,"0")).join("")}function f(){n&&t.forEach(a=>{const i=n.querySelector(`.has-background-neutral-${a}`);if(!i)return;const d=getComputedStyle(i).backgroundColor,l=document.getElementById(`hex-${a}`);l&&(l.textContent=u(d))})}function y(){if(!e||!r||!o||!s)return;const a=e.value,i=r.value;o.textContent=a,s.textContent=i,document.documentElement.style.setProperty("--color-neutral-h",a),document.documentElement.style.setProperty("--color-neutral-c",i),requestAnimationFrame(f)}e.addEventListener("input",y),r.addEventListener("input",y),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{requestAnimationFrame(f)}),f()};document.addEventListener("DOMContentLoaded",E);const p=document.querySelectorAll("[popover='hint']"),c=document.querySelectorAll("[data-demo-tooltip]");function C(t){c[t].addEventListener("mouseover",()=>{p[t].showPopover({source:c[t]})}),c[t].addEventListener("mouseout",()=>{p[t].hidePopover()}),c[t].addEventListener("focus",()=>{p[t].showPopover({source:c[t]})}),c[t].addEventListener("blur",()=>{p[t].hidePopover()})}for(let t=0;t<c.length;t++)C(t);
