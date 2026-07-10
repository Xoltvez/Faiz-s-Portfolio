import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectsData } from "./data.js";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // 1. Theme Configuration
  const themeToggleBtn = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      let theme = document.documentElement.getAttribute("data-theme");
      if (theme === "light") {
        theme = "dark";
      } else {
        theme = "light";
      }
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    });
  }

  // 1.5 Navbar Blur on Scroll
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      if (nav) nav.classList.add("scrolled");
    } else {
      if (nav) nav.classList.remove("scrolled");
    }
  });

  // 2. Preloader Animation
  const preloader = document.querySelector(".preloader");
  const ptPanel = document.querySelector(".pt-panel");
  const urlParams = new URLSearchParams(window.location.search);
  const skipPreloader = urlParams.get("skip") === "1";

  if (skipPreloader) {
    if (preloader) preloader.style.display = "none";
    if (ptPanel) {
      gsap.to(ptPanel, {
        yPercent: -100,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          document.documentElement.classList.remove("page-returning");
        },
      });
    } else {
      document.documentElement.classList.remove("page-returning");
    }
  } else if (preloader) {
      let counter = { value: 0 };
      const counterElement = document.getElementById("counter");

      gsap.to(counter, {
        value: 100,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          if (counterElement) {
            counterElement.textContent = Math.floor(counter.value) + "%";
          }
        },
        onComplete: () => {
          gsap.to(preloader, {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut",
          });
        },
      });
    }

  // 3. Custom Cursor & Project Preview
  const cursor = document.querySelector(".cursor");
  const projectWrapper = document.querySelector(".project-preview-wrapper");
  const projectImg = document.querySelector(".project-preview-img");
  const projectView = document.querySelector(".project-preview-view");

  let mouseX = 0,
    mouseY = 0,
    cursorX = 0,
    cursorY = 0,
    previewX = window.innerWidth / 2,
    previewY = window.innerHeight / 2,
    viewX = window.innerWidth / 2,
    viewY = window.innerHeight / 2,
    currentScrollVelocity = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

  const renderCursor = () => {
    cursorX = lerp(cursorX, mouseX, 0.15);
    cursorY = lerp(cursorY, mouseY, 0.15);
    if (cursor) cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

    if (projectWrapper) {
      previewX = lerp(previewX, mouseX, 0.1);
      previewY = lerp(previewY, mouseY, 0.1);
      viewX = lerp(viewX, mouseX, 0.15);
      viewY = lerp(viewY, mouseY, 0.15);
      
      currentScrollVelocity = lerp(currentScrollVelocity, 0, 0.1);
      let rotate = currentScrollVelocity * 0.2;
      let skew = currentScrollVelocity * 0.1;

      projectWrapper.style.transform = `translate(${previewX}px, ${previewY}px) rotate(${rotate}deg) skewX(${skew}deg)`;
      if (projectView) projectView.style.transform = `translate(${viewX - previewX}px, ${viewY - previewY}px)`;
    }

    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Global hover states for generic interactive elements
  const interactiveElements = document.querySelectorAll(".hover-target, a, button");
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (cursor) cursor.classList.add("active");
    });
    el.addEventListener("mouseleave", () => {
      if (cursor) cursor.classList.remove("active");
    });
  });

  // 4. Render Work Grid & List
  const workGrid = document.getElementById("work-grid");
  const workListBody = document.getElementById("work-list-body");
  
  function attachProjectInteractions() {
    // Project Click Transition & Hover Preview
    document.querySelectorAll(".work-card, .work-list-row").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetUrl = link.getAttribute("href");
        if (ptPanel) {
          gsap.set(ptPanel, { yPercent: 100 });
          gsap.to(ptPanel, {
            yPercent: 0,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
              window.location.href = targetUrl;
            },
          });
        } else {
          window.location.href = targetUrl;
        }
      });
      
      // Hover interaction for custom cursor
      link.addEventListener("mouseenter", () => {
        if (cursor) cursor.classList.add("active");
        
        // Project preview for list view
        if (link.classList.contains("work-list-row")) {
          const img = link.getAttribute("data-image");
          if (img && projectImg) {
            projectImg.style.backgroundImage = `url(${img})`;
          }
          if (projectWrapper) {
            projectWrapper.classList.add("active");
            gsap.to(projectWrapper, { scale: 1, duration: 0.3, ease: "power2.out" });
          }
        }
      });
      
      link.addEventListener("mouseleave", () => {
        if (cursor) cursor.classList.remove("active");
        
        if (projectWrapper && link.classList.contains("work-list-row")) {
          projectWrapper.classList.remove("active");
          gsap.to(projectWrapper, { scale: 0, duration: 0.3, ease: "power2.in" });
        }
      });
    });
    
    ScrollTrigger.refresh();
  }

  function renderProjects(filter = "all") {
    let gridHTML = "";
    let listHTML = "";
    
    projectsData.forEach((project, index) => {
      const roleLower = project.role.toLowerCase();
      let category = "development";
      if (roleLower.includes("ui") || roleLower.includes("ux") || roleLower.includes("design") || roleLower.includes("qa")) {
        category = "design";
      }
      
      if (filter !== "all" && category !== filter) return;

      const year = project.date.split(" ")[1] || project.date;
      
      gridHTML += `
        <a href="/project.html?id=${index}" class="work-card hover-target reveal-text" data-index="${index}">
          <div class="work-card-image-wrapper">
            <img src="${project.image}" alt="${project.title}" class="work-card-img" loading="lazy" />
          </div>
          <div class="work-card-meta">
            <h3 class="work-card-title">${project.title}</h3>
            <div class="work-card-tags">
              <span>${project.role}</span>
              <span class="work-card-year">${year}</span>
            </div>
          </div>
        </a>
      `;
      
      listHTML += `
        <a href="/project.html?id=${index}" class="work-list-row hover-target" data-index="${index}" data-image="${project.image}">
          <div class="col-client">${project.title}</div>
          <div class="col-location">Indonesia</div>
          <div class="col-services">${project.role}</div>
          <div class="col-year">${year}</div>
        </a>
      `;
    });
    
    if (workGrid) workGrid.innerHTML = gridHTML;
    if (workListBody) workListBody.innerHTML = listHTML;
    
    attachProjectInteractions();
  }

  // Calculate dynamic project counts
  const designCount = projectsData.filter(p => {
    const roleLower = p.role.toLowerCase();
    return roleLower.includes("ui") || roleLower.includes("ux") || roleLower.includes("design") || roleLower.includes("qa");
  }).length;
  const devCount = projectsData.length - designCount;

  const designBtn = document.querySelector('[data-filter="design"]');
  const devBtn = document.querySelector('[data-filter="development"]');
  if (designBtn) designBtn.innerHTML = `Design <sup>${designCount}</sup>`;
  if (devBtn) devBtn.innerHTML = `Development <sup>${devCount}</sup>`;

  // Initial render
  if (workGrid || workListBody) {
    renderProjects("all");
  }

  // 5. Filter Logic
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      renderProjects(filter);
    });
  });

  // 6. View Toggle Logic
  const viewBtns = document.querySelectorAll(".view-btn");
  const workList = document.getElementById("work-list");
  viewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      viewBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const view = btn.getAttribute("data-view");
      if (view === "list") {
        if (workGrid) workGrid.style.display = "none";
        if (workList) workList.style.display = "block";
      } else {
        if (workGrid) workGrid.style.display = "grid";
        if (workList) workList.style.display = "none";
      }
      ScrollTrigger.refresh();
    });
  });

  // 6.5 Navbar Click Transitions
  const navLinks = document.querySelectorAll(".nav-links a, .logo");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.id === "theme-toggle" || link.closest("#theme-toggle") || link.getAttribute("href") === "#") return;
      const targetUrl = link.getAttribute("href");
      if (targetUrl) {
        e.preventDefault();
        if (ptPanel) {
          gsap.set(ptPanel, { yPercent: 100 });
          gsap.to(ptPanel, {
            yPercent: 0,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
              window.location.href = targetUrl;
            },
          });
        } else {
          window.location.href = targetUrl;
        }
      }
    });
  });

  // 7. Reveal Text Animation Setup
  const revealElements = document.querySelectorAll(".reveal-text");
  revealElements.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // 8. Initialize Smooth Scrolling (Lenis)
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on("scroll", (e) => {
    ScrollTrigger.update();
    currentScrollVelocity = e.velocity;
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});
