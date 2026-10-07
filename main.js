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
        <a href="/portfolio/${project.slug}" class="gallery-card hover-target reveal-text" data-index="${index}">
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

  // 4. Scroll Animations (Text Reveal & About Me Character Highlight)
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

  // Helper to split text into word & character spans preserving spacing
  function splitTextToChars(element) {
    if (!element) return [];
    if (element.querySelector(".char")) {
      return element.querySelectorAll(".char");
    }
    const text = element.textContent.trim();
    const words = text.split(/\s+/);

    element.innerHTML = words
      .map((word) => {
        const chars = Array.from(word)
          .map((char) => `<span class="char">${char}</span>`)
          .join("");
        return `<span class="word">${chars}</span>`;
      })
      .join(" ");

    return element.querySelectorAll(".char");
  }

  // Character-by-character highlight animation on scroll for About Me
  const aboutHeading = document.querySelector(".about-heading");
  const aboutParagraph = document.querySelector(".about-text p");

  if (aboutHeading) {
    const headingChars = splitTextToChars(aboutHeading);

    gsap.fromTo(
      headingChars,
      {
        opacity: 0.18,
        color: "var(--text-secondary)",
      },
      {
        opacity: 1,
        color: "var(--text-primary)",
        stagger: 0.02,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-me",
          start: "top 70%",
          end: "top 15%",
          scrub: 0.5,
        },
      }
    );
  }

  if (aboutParagraph) {
    const paragraphChars = splitTextToChars(aboutParagraph);

    gsap.fromTo(
      paragraphChars,
      {
        opacity: 0.18,
        color: "var(--text-secondary)",
      },
      {
        opacity: 1,
        color: "var(--text-primary)",
        stagger: 0.015,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-text",
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.5,
        },
      }
    );
  }


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

  // 6. Dynamic Island Navigation Logic
  const dynamicIsland = document.getElementById("dynamic-island");
  const scrollPercentEl = document.getElementById("scroll-percent");
  const islandSecNum = document.getElementById("island-sec-num");
  const islandSecName = document.getElementById("island-sec-name");
  const islandLinks = document.querySelectorAll(".island-link");
  const activePill = document.getElementById("nav-active-pill");

  function updateActivePill(targetLink) {
    if (!targetLink || !activePill) return;
    const parent = targetLink.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    // Prevent updating pill position if links are collapsed / hidden
    if (linkRect.width === 0 || parentRect.width === 0) return;

    const left = linkRect.left - parentRect.left;
    const width = linkRect.width;

    activePill.style.left = `${left}px`;
    activePill.style.width = `${width}px`;
    activePill.style.opacity = "1";
  }

  // Set initial active pill position
  const initialActiveLink = document.querySelector(".island-link.active");
  if (initialActiveLink) {
    setTimeout(() => updateActivePill(initialActiveLink), 150);
  }

  // Hover effect on island links
  islandLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      updateActivePill(link);
    });
  });

  const linksWrapper = document.querySelector(".nav-links-wrapper");
  if (linksWrapper) {
    linksWrapper.addEventListener("mouseleave", () => {
      const currentActive = document.querySelector(".island-link.active");
      if (currentActive) {
        updateActivePill(currentActive);
      }
    });
  }

  // Scroll handler: Calculate percentage, section observer & collapse morphing with hysteresis
  let lastScrollY = window.scrollY;
  const scrollThreshold = 10; // Require significant scroll movement to toggle state

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = Math.max(0, Math.min(100, Math.round((currentScrollY / (maxScroll || 1)) * 100)));

    if (scrollPercentEl) {
      scrollPercentEl.textContent = `${percent}%`;
    }

    if (dynamicIsland) {
      if (currentScrollY < 80) {
        // At the top of page: always expanded
        dynamicIsland.classList.remove("collapsed");
      } else if (scrollDelta > scrollThreshold && currentScrollY > 120) {
        // Scrolling DOWN past threshold -> collapse
        dynamicIsland.classList.add("collapsed");
      } else if (scrollDelta < -scrollThreshold) {
        // Scrolling UP past threshold -> expand
        dynamicIsland.classList.remove("collapsed");
      }
      // When stopped (scrollDelta near 0), keep existing collapsed state without flickering!
    }

    lastScrollY = currentScrollY;
  });

  function setActiveNavSection(secNum, secName, href) {
    if (islandSecNum) islandSecNum.textContent = secNum;
    if (islandSecName) islandSecName.textContent = secName;

    islandLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");
      if (linkHref === href || linkHref.includes(href)) {
        islandLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        updateActivePill(link);
      }
    });
  }

  // Section Observer for updating Compact Badge & Active Link
  const sections = document.querySelectorAll("section[id]");
  if (sections.length > 0) {
    const sectionMapping = {
      "home": { sec: "01", name: "HOME", href: "#home" },
      "about": { sec: "02", name: "ABOUT", href: "#about" },
      "skills": { sec: "03", name: "SKILLS", href: "#skills" },
      "tech": { sec: "03", name: "SKILLS", href: "#skills" },
      "project": { sec: "04", name: "PORTFOLIO", href: "/portfolio" },
      "all-projects": { sec: "04", name: "PORTFOLIO", href: "/portfolio" },
      "contact": { sec: "05", name: "CONTACT", href: "#contact" },
    };

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -50% 0px",
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const secId = entry.target.getAttribute("id");
          const mapping = sectionMapping[secId];
          if (mapping) {
            setActiveNavSection(mapping.sec, mapping.name, mapping.href);
          }
        }
      });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

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
        const getShiftUpper = () => {
          const w = upperTrack.scrollWidth - window.innerWidth + 120;
          return w > 0 ? -w : -500;
        };
        const getShiftLower = () => {
          const w = lowerTrack.scrollWidth - window.innerWidth + 120;
          return w > 0 ? w : 500;
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gallerySection,
            pin: true,
            anticipatePin: 1,
            scrub: true,
            start: "top top",
            end: () => `+=${Math.max(1200, upperTrack.scrollWidth - window.innerWidth + 400)}`,
            invalidateOnRefresh: true,
            onEnter: () => setActiveNavSection("04", "PORTFOLIO", "/portfolio"),
            onEnterBack: () => setActiveNavSection("04", "PORTFOLIO", "/portfolio"),
          }
        });
        
        // Baris atas bergeser ke kiri seluas seluruh track
        tl.to(upperTrack, {
          x: getShiftUpper,
          ease: "none",
        }, 0);
        
        // Baris bawah mulai dari posisi tergeser ke kiri, lalu bergeser ke kanan
        gsap.set(lowerTrack, { x: () => -getShiftLower() });
        tl.to(lowerTrack, {
          x: 0,
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
        const index = parseInt(item.getAttribute("data-index"), 10);
        const project = projectsData[index];
        targetUrl = `/portfolio/${project.slug}`;
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

  // Mobile Menu Toggle Logic
  const menuToggleBtn = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  const mobileLinkSpans = document.querySelectorAll(".mobile-nav-link span");

  if (menuToggleBtn && mobileMenu) {
    let isMenuOpen = false;

    // Set initial GSAP states to prevent conflicts with CSS transform
    gsap.set(mobileMenu, { yPercent: -100, autoAlpha: 0 });
    gsap.set(mobileLinkSpans, { yPercent: 100, opacity: 0 });

    // Create GSAP Timeline for the mobile menu animation
    const menuTimeline = gsap.timeline({ paused: true });

    // Overlay slides down
    menuTimeline.to(mobileMenu, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.75,
      ease: "power4.inOut"
    });

    // Staggered text fade in & slide up
    menuTimeline.to(mobileLinkSpans, {
      yPercent: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out"
    }, "-=0.3");

    menuToggleBtn.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen;
      menuToggleBtn.classList.toggle("active", isMenuOpen);
      
      if (isMenuOpen) {
        document.body.style.overflow = "hidden";
        if (typeof lenis !== "undefined") lenis.stop();
        mobileMenu.style.pointerEvents = "auto";
        menuTimeline.play();
      } else {
        document.body.style.overflow = "";
        if (typeof lenis !== "undefined") lenis.start();
        mobileMenu.style.pointerEvents = "none";
        menuTimeline.reverse();
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        isMenuOpen = false;
        menuToggleBtn.classList.remove("active");
        mobileMenu.style.pointerEvents = "none";
        document.body.style.overflow = "";
        if (typeof lenis !== "undefined") lenis.start();

        // Animate menu close
        menuTimeline.reverse();

        if (link.classList.contains("mobile-portfolio-link")) {
          e.preventDefault();
          const targetUrl = "/portfolio?skip=1";
          if (ptPanel) {
            gsap.fromTo(ptPanel,
              { yPercent: 100 },
              {
                yPercent: 0,
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
        } else {
          const targetId = link.getAttribute("href");
          if (targetId.startsWith("#")) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement && typeof lenis !== "undefined") {
              setTimeout(() => {
                lenis.scrollTo(targetElement, { offset: -100 });
              }, 600); // Wait for reverse animation to finish
            }
          }
        }
      });
    });
  }

  // 9. Tech Stack Bento Filter, Lazy Loading & Spotlight Interaction
  const techSection = document.querySelector("#tech");
  const techFilterBtns = document.querySelectorAll(".tech-filter-btn");
  const bentoCards = document.querySelectorAll(".bento-card");

  if (techSection && bentoCards.length > 0) {
    // Set initial hidden state for lazy entrance animation
    gsap.set(bentoCards, { opacity: 0, y: 45, scale: 0.94 });

    // Lazy load reveal when user scrolls into view (ScrollTrigger)
    ScrollTrigger.create({
      trigger: techSection,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(bentoCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.07,
          ease: "back.out(1.2)",
          clearProps: "transform,opacity"
        });
      }
    });

    if (techFilterBtns.length > 0) {
      techFilterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const filterVal = btn.getAttribute("data-filter");

          // Update active filter pill button
          techFilterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          // Animate cards filtering using GSAP
          bentoCards.forEach((card) => {
            const cardCat = card.getAttribute("data-category");
            const shouldShow = filterVal === "all" || cardCat === filterVal;

            if (shouldShow) {
              card.classList.remove("filtered-out");
              gsap.fromTo(card,
                { opacity: 0, scale: 0.92, y: 15 },
                { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power2.out", clearProps: "transform,opacity" }
              );
            } else {
              gsap.to(card, {
                opacity: 0,
                scale: 0.92,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                  card.classList.add("filtered-out");
                }
              });
            }
          });
        });
      });
    }

    // Spotlight cursor follow glow inside bento cards
    bentoCards.forEach((card) => {
      const glow = card.querySelector(".bento-glow");
      if (glow) {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 136, 204, 0.2) 0%, transparent 60%)`;
        });
      }
    });
  }

  // Refresh ScrollTrigger after all resources/images are loaded
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
});
