import{g as r,S as C,p as I,L as N}from"./data-BEzoEWqM.js";r.registerPlugin(C);document.addEventListener("DOMContentLoaded",()=>{const L=localStorage.getItem("theme")||"dark";document.documentElement.setAttribute("data-theme",L);const l=document.querySelector(".pt-panel");l&&r.set(l,{yPercent:0});const E=new URLSearchParams(window.location.search).get("id"),d=E!==null?parseInt(E,10):null;if(d!==null&&!isNaN(d)&&I[d]){const e=I[d];document.getElementById("pm-banner-title").innerText=e.title,document.getElementById("pm-desc").innerText=e.description,document.getElementById("pm-year").innerText=e.date,document.getElementById("pm-role").innerText=e.role;const m=document.getElementById("pm-banner-bg");m&&(m.style.backgroundImage=`url(${e.image})`);const o=document.getElementById("pm-image-wrapper");o.innerHTML="";const p=e.detailImages&&e.detailImages.length>0?e.detailImages:[e.image];if((e.mockupType||"laptop")==="phone"){const s=document.createElement("div");s.className="pm-mockups-row",p.slice(0,3).forEach((i,t)=>{const n=/\.(mp4|webm|ogg)$/i.test(i);let a="";n?a=`
            <video class="pm-video-mockup" autoplay loop muted playsinline>
              <source src="${i}" type="video/${i.split(".").pop()}" />
              Your browser does not support the video tag.
            </video>
          `:a=`
            <img src="${i}" class="pm-image-mockup" alt="${e.title} Preview ${t}" />
          `;const c=document.createElement("div");c.className="phone-mockup",c.innerHTML=`
          <div class="phone-screen">
            <div class="phone-dynamic-island"></div>
            <div class="phone-content">
              ${a}
            </div>
          </div>
        `,s.appendChild(c)}),o.appendChild(s),p.length>3&&p.slice(3).forEach((i,t)=>{if(/\.(mp4|webm|ogg)$/i.test(i)){const a=document.createElement("div");a.className="pm-video-container";const c=document.createElement("video");c.src=i,c.className="pm-flat-video",c.autoplay=!0,c.loop=!0,c.muted=!0,c.playsInline=!0,a.appendChild(c),o.appendChild(a)}else{const a=document.createElement("img");a.src=i,a.className="pm-image",a.alt=`${e.title} Screenshot ${t+3}`,a.loading="lazy",o.appendChild(a)}})}else p.forEach((s,f)=>{if(f===0){const i=/\.(mp4|webm|ogg)$/i.test(s);let t="";i?t=`
              <video class="pm-video-mockup" autoplay loop muted playsinline>
                <source src="${s}" type="video/${s.split(".").pop()}" />
                Your browser does not support the video tag.
              </video>
            `:t=`
              <img src="${s}" class="pm-image-mockup" alt="${e.title} Preview" />
            `;const n=document.createElement("div");n.className="laptop-mockup",n.innerHTML=`
            <div class="laptop-screen">
              <div class="laptop-camera"></div>
              <div class="laptop-content">
                ${t}
              </div>
            </div>
            <div class="laptop-base">
              <div class="laptop-notch"></div>
            </div>
          `,o.appendChild(n)}else if(/\.(mp4|webm|ogg)$/i.test(s)){const t=document.createElement("div");t.className="pm-video-container";const n=document.createElement("video");n.src=s,n.className="pm-flat-video",n.autoplay=!0,n.loop=!0,n.muted=!0,n.playsInline=!0,t.appendChild(n),o.appendChild(t)}else{const t=document.createElement("img");t.src=s,t.className="pm-image",t.alt=`${e.title} Screenshot ${f}`,t.loading="lazy",o.appendChild(t)}});m&&r.to(m,{yPercent:20,ease:"none",scrollTrigger:{trigger:".pm-header-banner",start:"top top",end:"bottom top",scrub:!0}})}else document.getElementById("pm-banner-title").innerText="Project Not Found";const k=r.timeline();l&&k.to(l,{yPercent:-100,duration:1,ease:"expo.inOut"}),k.fromTo(".pm-banner-title",{y:70,opacity:0},{y:0,opacity:1,duration:1.2,ease:"power4.out"},"-=0.5").fromTo(".pm-banner-meta .pm-meta-item",{y:30,opacity:0},{y:0,opacity:1,duration:.8,stagger:.1,ease:"power3.out"},"-=0.9").fromTo([".laptop-mockup",".phone-mockup",".pm-image-wrapper > .pm-image",".pm-video-container"],{y:60,opacity:0},{y:0,opacity:1,duration:1,stagger:.15,ease:"power3.out"},"-=0.6");const g=new N({duration:1.2,smooth:!0,syncTouch:!0}),$=e=>{g.raf(e),requestAnimationFrame($)};requestAnimationFrame($),g.on("scroll",C.update),r.ticker.add(e=>{g.raf(e*1e3)}),r.ticker.lagSmoothing(0);const u=document.querySelector(".cursor");let b=0,w=0,v=0,y=0;if(u){document.addEventListener("mousemove",o=>{b=o.clientX,w=o.clientY});const e=(o,p,h)=>(1-h)*o+h*p,m=()=>{v=e(v,b,.15),y=e(y,w,.15),u.style.transform=`translate(${v}px, ${y}px)`,requestAnimationFrame(m)};requestAnimationFrame(m),document.querySelectorAll(".hover-target, a, button").forEach(o=>{o.addEventListener("mouseenter",()=>u.classList.add("active")),o.addEventListener("mouseleave",()=>u.classList.remove("active"))})}const T=document.getElementById("pm-close");T&&l&&T.addEventListener("click",e=>{e.preventDefault(),P("/?skip=1")});const P=e=>{r.set(l,{yPercent:100}),r.to(l,{yPercent:0,duration:.9,ease:"expo.inOut",onComplete:()=>{window.location.href=e}})}});
