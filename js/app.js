// Elements
const navbar = document.querySelector("#nav");
const navBtn = document.querySelector("#nav-btn");
const closeBtn = document.querySelector("#close-btn");
const sidebar = document.querySelector("#sidebar");
const date = document.querySelector("#date");

// Fixed navbar on scroll
window.addEventListener("scroll", function () {
  if (window.pageYOffset > 80) {
    navbar.classList.add("navbar-fixed");
  } else {
    navbar.classList.remove("navbar-fixed");
  }
});

// Show sidebar
if (navBtn) {
  navBtn.addEventListener("click", function () {
    sidebar.classList.add("show-sidebar");
  });
}

// Close sidebar
if (closeBtn) {
  closeBtn.addEventListener("click", function () {
    sidebar.classList.remove("show-sidebar");
  });
}

// Set year
if (date) {
  date.textContent = new Date().getFullYear();
}

// Scroll-triggered fade-in animations
const fadeElements = document.querySelectorAll(".fade-in");

if (fadeElements.length > 0) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });
}
