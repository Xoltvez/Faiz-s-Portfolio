import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectsData } from "./data.js";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {  // Render Projects Dynamically
  const expList = document.querySelector(".exp-list");
  if (expList) {
    let projectsHTML = "";
    projectsData.slice(0, 5).forEach((project, index) => {
      projectsHTML += `
        <div class="exp-item hover-target reveal-text" data-image="${project.image}" data-index="${index}">
          <div class="exp-meta">
            <span>${project.date}</span><br /><span>${project.role}</span>
          </div>
          <div class="exp-details">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
          </div>
        </div>
      `;
    });
    expList.innerHTML = projectsHTML;
  }

  // Render Projects Grid (Dennis Snellenberg Style Showcase - 2 Rows)
  const upperTrack = document.querySelector(".upper-track");
  const lowerTrack = document.querySelector(".lower-track");
  
  if (upperTrack && lowerTrack) {
    let upperHTML = "";
    let lowerHTML = "";
    const bgColor = "#e3e3e3"; // Warna background abu-abu terang seragam untuk semua kartu
    
    projectsData.forEach((project, index) => {
      const year = project.date.split(" ")[1] || project.date;
      
      const cardHTML = `
        <a href="/project?id=${index}" class="gallery-card hover-target reveal-text" data-index="${index}">
          <div class="gallery-card-image-wrapper" style="background-color: ${bgColor};">
            ${project.image ? `<img src="${project.image}" alt="${project.title} Preview" class="gallery-card-img" loading="lazy" />` : ''}
          </div>
          <div class="gallery-card-meta">
            <div class="gallery-card-header">
              <h3 class="gallery-card-title">${project.title}</h3>
              <span class="gallery-card-year">${year}</span>
            </div>
            <div class="gallery-card-divider"></div>
            <div class="gallery-card-footer">
              <span class="gallery-card-role">${project.role}</span>
            </div>
          </div>
        </a>
      `;
      
      // Bagi project secara seimbang ke baris atas dan baris bawah
      if (index < Math.ceil(projectsData.length / 2)) {
        upperHTML += cardHTML;
      } else {
        lowerHTML += cardHTML;
      }
    });
    
    upperTrack.innerHTML = upperHTML;
    lowerTrack.innerHTML = lowerHTML;
  }

  // 1. Preloader Animation
  const preloader = document.querySelector(".preloader");
  const ptPanel = document.querySelector(".pt-panel");
  const urlParams = new URLSearchParams(window.location.search);
  const skipPreloader = urlParams.get("skip") === "1";

  if (skipPreloader && preloader) {
    // Instantly hide preloader
    preloader.style.display = "none";

    // Set panel to COVER screen initially and slide it OUT upward
    if (ptPanel) {
      gsap.fromTo(ptPanel,
        { yPercent: 0 },        // start: covering screen
        {
          yPercent: -100,       // end: off-screen above
          duration: 1,
          ease: "expo.inOut",
          onComplete: () => {
            // Reset to below so next click always comes from bottom
            gsap.set(ptPanel, { yPercent: 100 });
          }
        }
      );
    }

    gsap.from(".huge-text", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      stagger: 0.1,
      delay: 0.3 // Delay slightly so it reveals as panel slides up
    });
    gsap.from(".hero-desc", {
      opacity: 0,
      y: 20,
      duration: 1,
      delay: 0.8
    });
    // Clean up URL to remove ?skip=1
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  } else {
    const counterElement = document.getElementById("counter");
    let count = 0;

    const updateCounter = () => {
      const increment = Math.floor(Math.random() * 5) + 1;
      count += increment;

      if (count > 100) {
        count = 100;
      }

      counterElement.textContent = count;

      if (count < 100) {
        setTimeout(updateCounter, 30 + Math.random() * 40);
      } else {
        const tl = gsap.timeline();
        tl.to(".preloader-content", {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.in",
        })
          .to(".preloader", {
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            duration: 1,
            ease: "expo.inOut",
            onComplete: () => {
              document.querySelector(".preloader").style.display = "none";
            },
          })
          .from(
            ".huge-text",
            {
              y: 100,
              opacity: 0,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.1,
            },
            "-=0.2",
          )
          .from(
            ".hero-desc",
            {
              opacity: 0,
              y: 20,
              duration: 1,
            },
            "-=0.8",
          );
      }
    };

    // Start counter
    setTimeout(updateCounter, 200);
  }

  // 2. Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  let currentScrollVelocity = 0;
  lenis.on("scroll", (e) => {
    ScrollTrigger.update();
    currentScrollVelocity = e.velocity;
  });
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2.3 Scroll to Hash on Load (Lenis compatible)
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      const delay = skipPreloader ? 900 : 2500;
      setTimeout(() => {
        lenis.scrollTo(target, { offset: -100 });
      }, delay);
    }
  }

  // 2.2 Smooth Scroll Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          lenis.scrollTo(targetElement, {
            offset: -100, // Offset for fixed navbar if needed
          });
        }
      }
    });
  });

  // 2.5 Hero Text Swapping
  const uiuxText = document.querySelector(".hero-uiux");
  const graphicText = document.querySelector(".hero-graphic");
  const designerText = document.querySelector(".hero-designer");

  if (uiuxText && graphicText && designerText) {
    let isState1 = true;
    setInterval(() => {
      uiuxText.classList.add("fade-out");
      graphicText.classList.add("fade-out");
      designerText.classList.add("fade-out");

      setTimeout(() => {
        isState1 = !isState1;
        uiuxText.textContent = isState1 ? "UI/UX" : "FRONTEND";
        graphicText.textContent = isState1 ? "GRAPHIC" : "BACKEND";
        designerText.textContent = isState1 ? "DESIGNER" : "DEVELOPER";

        uiuxText.classList.remove("fade-out");
        graphicText.classList.remove("fade-out");
        designerText.classList.remove("fade-out");
      }, 500);
    }, 4000);
  }

  // 3. Custom Cursor
  const cursor = document.querySelector(".cursor");
  let mouseX = 0,
    mouseY = 0,
    cursorX = 0,
    cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

  const renderCursor = () => {
    cursorX = lerp(cursorX, mouseX, 0.15);
    cursorY = lerp(cursorY, mouseY, 0.15);
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Hover states for cursor
  const interactiveElements = document.querySelectorAll(".hover-target, a");
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });

  // 3.5 Project Hover Preview
  const projectWrapper = document.querySelector(".project-preview-wrapper");
  const projectImg = document.querySelector(".project-preview-img");
  const projectView = document.querySelector(".project-preview-view");

  if (projectWrapper) {
    let previewX = window.innerWidth / 2;
    let previewY = window.innerHeight / 2;
    let viewX = window.innerWidth / 2;
    let viewY = window.innerHeight / 2;

    const renderPreview = () => {
      previewX = lerp(previewX, mouseX, 0.1);
      previewY = lerp(previewY, mouseY, 0.1);

      viewX = lerp(viewX, mouseX, 0.15);
      viewY = lerp(viewY, mouseY, 0.15);

      // Decay velocity when scrolling stops
      currentScrollVelocity = lerp(currentScrollVelocity, 0, 0.1);

      // Calculate skew and rotation based on velocity (Dennis Snellenberg effect)
      let rotate = currentScrollVelocity * 0.2;
      let skew = currentScrollVelocity * 0.1;

      gsap.set(projectWrapper, {
        x: previewX,
        y: previewY,
        xPercent: -50,
        yPercent: -50
      });
      gsap.set(projectView, { x: viewX - previewX, y: viewY - previewY });

      requestAnimationFrame(renderPreview);
    };
    requestAnimationFrame(renderPreview);

    const expItems = document.querySelectorAll(".exp-item");
    expItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        const imgSrc = item.getAttribute("data-image");
        if (imgSrc) {
          projectImg.style.backgroundImage = `url("${imgSrc}")`;
        }

        // Hide default cursor
        gsap.to(cursor, { opacity: 0, duration: 0.3 });

        // Show wrapper
        gsap.to(projectWrapper, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        });

        // Scale up view button
        gsap.fromTo(
          projectView,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            delay: 0.1,
          },
        );
      });

      item.addEventListener("mouseleave", () => {
        // Show default cursor
        gsap.to(cursor, { opacity: 1, duration: 0.3 });

        // Hide wrapper
        gsap.to(projectWrapper, {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
        });
      });
    });
  }

  // 4. Scroll Animations (Text Reveal)
  const revealTexts = document.querySelectorAll(".reveal-text, .section-title");

  revealTexts.forEach((text) => {
    gsap.from(text, {
      scrollTrigger: {
        trigger: text,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  });

  // 5. Galaxy Rotation
  const galaxyRings = [
    {
      ring: ".ring-1",
      counter: ".counter-spin-1",
      duration: 25,
      reverse: false,
    },
    {
      ring: ".ring-2",
      counter: ".counter-spin-2",
      duration: 35,
      reverse: true,
    },
    {
      ring: ".ring-3",
      counter: ".counter-spin-3",
      duration: 45,
      reverse: false,
    },
  ];

  galaxyRings.forEach((g) => {
    gsap.to(g.ring, {
      rotationZ: g.reverse ? -360 : 360,
      duration: g.duration,
      repeat: -1,
      ease: "none",
    });

    gsap.to(g.counter, {
      rotationZ: g.reverse ? 360 : -360,
      duration: g.duration,
      repeat: -1,
      ease: "none",
    });
  });

  // 6. Navbar Blur on Scroll
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // 7. Theme Toggle
  const themeToggleBtn = document.getElementById("theme-toggle");
  // Set initial theme based on localStorage, default to dark
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      let theme = document.documentElement.getAttribute("data-theme");
      if (theme === "dark") {
        theme = "light";
      } else {
        theme = "dark";
      }
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    });
  }

  // 7.5 Horizontal Scroll Animation for Projects Showcase (Dennis Snellenberg Style - 2 Rows)
  const gallerySection = document.querySelector(".projects-gallery");

  if (upperTrack && lowerTrack && gallerySection) {
    // Only run horizontal pinning on desktop (width > 768px)
    ScrollTrigger.matchMedia({
      "(min-width: 769px)": function() {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gallerySection,
            pin: true,
            scrub: 1.2,
            start: "top top",
            end: "+=1200", // Panjang track scroll pinning
            invalidateOnRefresh: true,
          }
        });
        
        // Baris atas bergeser ke kiri
        tl.to(upperTrack, {
          x: -380,
          ease: "none",
        }, 0);
        
        // Baris bawah mulai dari kiri (shifted) dan bergeser ke kanan
        gsap.set(lowerTrack, { x: -380 });
        tl.to(lowerTrack, {
          x: 40,
          ease: "none",
        }, 0);
      }
    });
  }

  // 8. Project Navigation — Single Panel Transition
  // ptPanel is already declared at the top of DOMContentLoaded
  
  // Ensure panel is hidden below screen (only if not running return transition)
  if (ptPanel && !skipPreloader) gsap.set(ptPanel, { yPercent: 100 });

  const transitionLinks = document.querySelectorAll(".exp-item, .gallery-card, .more-work-btn, .nav-portfolio-link");
  transitionLinks.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault(); // Mencegah aksi redirect instan
      
      let targetUrl;
      if (item.classList.contains("more-work-btn") || item.classList.contains("nav-portfolio-link")) {
        targetUrl = "/portfolio?skip=1";
      } else {
        const index = item.getAttribute("data-index");
        targetUrl = `/project?id=${index}`;
      }

      // Slide sweep panel naik dari bawah untuk menutup layar, lalu navigasi
      if (ptPanel) {
        gsap.fromTo(ptPanel,
          { yPercent: 100 },      // Mulai dari bawah layar
          {
            yPercent: 0,          // Geser ke atas menutup layar
            duration: 0.9,
            ease: "expo.inOut",
            onComplete: () => {
              window.location.href = targetUrl;
            },
          }
        );
      } else {
        window.location.href = targetUrl;
      }
    });
  });
});
