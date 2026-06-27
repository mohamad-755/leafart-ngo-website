/* ============================================================
   LeafArt NGO — Shared JavaScript
   - Mobile hamburger menu
   - Scroll reveal animations (IntersectionObserver)
   - Faux cart counter
   - Project gallery filtering
   - Contact form + newsletter (non-functional placeholders)
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile Menu ---------- */
  function initMenu() {
    var toggle = document.querySelector(".hamburger");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu when a link is clicked (mobile)
    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll Reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Faux Cart ---------- */
  function initCart() {
    var countEl = document.querySelector(".cart-count");
    var buttons = document.querySelectorAll("[data-add-to-cart]");
    if (!buttons.length) return;

    var count = 0;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        count += 1;
        if (countEl) {
          countEl.textContent = String(count);
          countEl.style.display = "flex";
        }
        var original = btn.textContent;
        btn.textContent = "Added \u2713";
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
        }, 1200);
      });
    });
  }

  /* ---------- Project Filtering ---------- */
  function initFilters() {
    var filterBtns = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".project-card");
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var filter = btn.getAttribute("data-filter");

        cards.forEach(function (card) {
          var cat = card.getAttribute("data-category");
          var show = filter === "all" || cat === filter;
          card.style.display = show ? "flex" : "none";
        });
      });
    });
  }

  /* ---------- Contact Form (placeholder) ---------- */
  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-success");
      if (msg) msg.classList.add("show");
      form.reset();
    });
  }

  /* ---------- Newsletter (placeholder) ---------- */
  function initNewsletter() {
    var forms = document.querySelectorAll(".newsletter-form");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector("input");
        if (input) {
          input.value = "";
          input.placeholder = "Thank you for subscribing!";
        }
      });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initReveal();
    initCart();
    initFilters();
    initContactForm();
    initNewsletter();
  });
})();
