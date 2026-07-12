import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectsData } from "./data.js";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // --- THEME ---
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);

  // --- SINGLE PANEL TRANSITION ---
  const ptPanel = document.querySelector(".pt-panel");

  // Panel starts fully covering the screen (translateY 0%)
  if (ptPanel) gsap.set(ptPanel, { yPercent: 0 });

  // --- LOAD PROJECT DATA ---
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  const id = idParam !== null ? parseInt(idParam, 10) : null;

  if (id !== null && !isNaN(id) && projectsData[id]) {
    const project = projectsData[id];
    
    // Set dynamic project details
    document.getElementById("pm-banner-title").innerText = project.title;
    document.getElementById("pm-desc").innerText = project.description;

    const pmLink = document.getElementById("pm-link");
    if (pmLink) {
      pmLink.href = project.link || "#";
    }
    document.getElementById("pm-year").innerText = project.date;
    document.getElementById("pm-role").innerText = project.role;

    // Set background image of the header banner
    const bannerBg = document.getElementById("pm-banner-bg");
    if (bannerBg) {
      if (project.image) {
        bannerBg.style.backgroundImage = `url(${project.image})`;
      } else {
        bannerBg.style.backgroundImage = "none";
      }
    }

    // Set dynamic screenshots: first one is inside a Laptop Mockup, the rest are normal flat images
    const pmImageWrapper = document.getElementById("pm-image-wrapper");
    pmImageWrapper.innerHTML = "";
    
    let imagesToRender =
      project.detailImages && project.detailImages.length > 0
        ? project.detailImages
        : (project.image ? [project.image] : []);
        
    // Filter out empty strings
    imagesToRender = imagesToRender.filter(img => img);

    const mockupType = project.mockupType || "laptop";

    if (mockupType === "phone") {
      // Create row container for mobile layout
      const mockupsRow = document.createElement("div");
      mockupsRow.className = "pm-mockups-row";
      
      // We render up to the first 3 screenshots as phone mockups in a row
      const phoneImages = imagesToRender.slice(0, 3);
      phoneImages.forEach((imgSrc, idx) => {
        const isVideo = /\.(mp4|webm|ogg)$/i.test(imgSrc);
        let screenContent = "";
        
        if (isVideo) {
          screenContent = `
            <video class="pm-video-mockup" autoplay loop muted playsinline>
              <source src="${imgSrc}" type="video/${imgSrc.split('.').pop()}" />
              Your browser does not support the video tag.
            </video>
          `;
        } else {
          screenContent = `
            <img src="${imgSrc}" class="pm-image-mockup" alt="${project.title} Preview ${idx}" />
          `;
        }

        const phoneMockup = document.createElement("div");
        phoneMockup.className = "phone-mockup";
        phoneMockup.innerHTML = `
          <div class="phone-screen">
            <div class="phone-dynamic-island"></div>
            <div class="phone-content">
              ${screenContent}
            </div>
          </div>
        `;
        mockupsRow.appendChild(phoneMockup);
      });
      
      pmImageWrapper.appendChild(mockupsRow);

      // Render any remaining screenshots (index >= 3) as flat elements below
      if (imagesToRender.length > 3) {
        imagesToRender.slice(3).forEach((imgSrc, idx) => {
          const isVideo = /\.(mp4|webm|ogg)$/i.test(imgSrc);
          if (isVideo) {
            const container = document.createElement("div");
            container.className = "pm-video-container";
            
            const video = document.createElement("video");
            video.src = imgSrc;
            video.className = "pm-flat-video";
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            
            container.appendChild(video);
            pmImageWrapper.appendChild(container);
          } else {
            const img = document.createElement("img");
            img.src = imgSrc;
            img.className = "pm-image";
            img.alt = `${project.title} Screenshot ${idx + 3}`;
            img.loading = "lazy";
            pmImageWrapper.appendChild(img);
          }
        });
      }
    } else {
      // Laptop: render single laptop mockup at the top, and subsequent images flat below
      imagesToRender.forEach((imgSrc, index) => {
        if (index === 0) {
          const isVideo = /\.(mp4|webm|ogg)$/i.test(imgSrc);
          let screenContent = "";
          
          if (isVideo) {
            screenContent = `
              <video class="pm-video-mockup" autoplay loop muted playsinline>
                <source src="${imgSrc}" type="video/${imgSrc.split('.').pop()}" />
                Your browser does not support the video tag.
              </video>
            `;
          } else {
            screenContent = `
              <img src="${imgSrc}" class="pm-image-mockup" alt="${project.title} Preview" />
            `;
          }

          const mockup = document.createElement("div");
          mockup.className = "laptop-mockup";
          mockup.innerHTML = `
            <div class="laptop-screen">
              <div class="laptop-camera"></div>
              <div class="laptop-content">
                ${screenContent}
              </div>
            </div>
            <div class="laptop-base">
              <div class="laptop-notch"></div>
            </div>
          `;
          pmImageWrapper.appendChild(mockup);
        } else {
          const isVideo = /\.(mp4|webm|ogg)$/i.test(imgSrc);
          if (isVideo) {
            const container = document.createElement("div");
            container.className = "pm-video-container";
            
            const video = document.createElement("video");
            video.src = imgSrc;
            video.className = "pm-flat-video";
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            
            container.appendChild(video);
            pmImageWrapper.appendChild(container);
          } else {
            const img = document.createElement("img");
            img.src = imgSrc;
            img.className = "pm-image";
            img.alt = `${project.title} Screenshot ${index}`;
            img.loading = "lazy";
            pmImageWrapper.appendChild(img);
          }
        }
      });
    }

    // --- PARALLAX EFFECT ---
    if (bannerBg) {
      gsap.to(bannerBg, {
        yPercent: 20, // Slide the image down slightly slower than scroll speed
        ease: "none",
        scrollTrigger: {
          trigger: ".pm-header-banner",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    }

    // --- NEXT PROJECT FOOTER ---
    const nextId = (id + 1) % projectsData.length;
    const nextProject = projectsData[nextId];
    
    const nextCaseTitle = document.getElementById("next-case-title");
    const nextCaseImg = document.getElementById("next-case-img");
    const nextCaseBtn = document.getElementById("next-case-btn");

    if (nextCaseTitle && nextProject) {
      nextCaseTitle.innerText = nextProject.title;
    }
    if (nextCaseImg && nextProject) {
      if (nextProject.image) {
        nextCaseImg.style.backgroundImage = `url(${nextProject.image})`;
      }
    }
    if (nextCaseBtn) {
      nextCaseBtn.addEventListener("click", () => {
        navigateWithTransition(`/project?id=${nextId}`);
      });
    }

  } else {
    document.getElementById("pm-banner-title").innerText = "Project Not Found";
  }

  // --- REVEAL: panel slides UP and off screen, content fades in ---
  const tl = gsap.timeline();

  if (ptPanel) {
    tl.to(ptPanel, {
      yPercent: -100,      // sweep panel off screen upward
      duration: 1,
      ease: "expo.inOut",
    });
  }
  
  // Fade in the hero components
  tl.fromTo(
    ".pm-banner-title",
    { y: 70, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
    "-=0.5"
  ).fromTo(
    ".pm-banner-meta .pm-meta-item",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
    "-=0.9"
  ).fromTo(
    [".laptop-mockup", ".phone-mockup", ".pm-image-wrapper > .pm-image", ".pm-video-container"],
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" },
    "-=0.6"
  );

  // --- LENIS ---
  const lenis = new Lenis({ 
    duration: 1.2, 
    smooth: true,
    syncTouch: true // sync scroll for touch events
  });
  const raf = (time) => { 
    lenis.raf(time); 
    requestAnimationFrame(raf); 
  };
  requestAnimationFrame(raf);

  // Bind ScrollTrigger with Lenis
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // --- CURSOR ---
  const cursor = document.querySelector(".cursor");
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  if (cursor) {
    document.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    const lerp = (a, b, t) => (1 - t) * a + t * b;
    const tick = () => {
      cursorX = lerp(cursorX, mouseX, 0.15);
      cursorY = lerp(cursorY, mouseY, 0.15);
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    document.querySelectorAll(".hover-target, a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("active"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
    });
  }

  // --- BACK TO HOME: panel slides UP from below to cover, then navigate ---
  const backBtn = document.getElementById("pm-close");
  if (backBtn && ptPanel) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      navigateWithTransition("/?skip=1");
    });
  }

  // Helper function to animate page transition out and navigate
  function navigateWithTransition(url) {
    // Force panel below screen
    gsap.set(ptPanel, { yPercent: 100 });

    // Slide panel UP to cover screen, then redirect
    gsap.to(ptPanel, {
      yPercent: 0,
      duration: 0.9,
      ease: "expo.inOut",
      onComplete: () => {
        window.location.href = url;
      },
    });
  }
});
