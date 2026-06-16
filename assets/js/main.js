/* RAD Motor Group — interactions */
(function () {
  "use strict";

  /* Sticky nav state */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu toggle */
  var toggle = document.querySelector(".nav__toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll(".nav__links a").forEach(function (link) {
      link.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Quote / contact form — submits to Netlify Forms via AJAX */
  var form = document.querySelector("[data-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form__status");
      var btn = form.querySelector("button[type=submit]");

      if (!form.checkValidity()) {
        if (status) {
          status.textContent = "Please fill in the required fields (name, email, division and project details).";
          status.style.color = "var(--rad-red-bright)";
        }
        return;
      }

      if (btn) { btn.disabled = true; }
      if (status) { status.textContent = "Sending…"; status.style.color = ""; }

      var body = new URLSearchParams(new FormData(form)).toString();
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
      }).then(function (res) {
        if (!res.ok) { throw new Error("Bad response"); }
        if (status) {
          status.textContent = "Thanks — your request has been received. The RAD team will be in touch within one business day.";
          status.style.color = "var(--rad-red-bright)";
        }
        form.reset();
      }).catch(function () {
        if (status) {
          status.textContent = "Something went wrong sending your request. Please call (825) 779-3922 or email connect@radmotorgroup.com.";
          status.style.color = "var(--rad-red-bright)";
        }
      }).finally(function () {
        if (btn) { btn.disabled = false; }
      });
    });
  }
})();
