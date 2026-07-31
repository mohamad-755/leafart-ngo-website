/* ============================================================
   LeafArt NGO — Shared JavaScript
   - Mobile hamburger menu
   - Scroll reveal animations (IntersectionObserver)
   - Faux cart counter
   - Project gallery filtering
   - Contact form + newsletter (wired to a form backend — see FORM_ENDPOINT)
   - Donate tier buttons (scroll to bank/OMT instructions until a payment processor is connected)
   ============================================================ */

(function () {
  "use strict";

  /* TODO(forms): Replace with the org's real Formspree (or Web3Forms) endpoint once an account
     exists — https://formspree.io -> create a form -> copy the "https://formspree.io/f/xxxxxxxx" URL.
     Until this is replaced, submissions are NOT sent anywhere; the UI shows a success message locally
     and logs a console warning so this isn't mistaken for a working integration. */
  var FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
  var FORM_ENDPOINT_CONFIGURED = FORM_ENDPOINT.indexOf("YOUR_FORM_ID") === -1;

  var PREFERS_REDUCED_MOTION =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll progress bar ---------- */
  function initScrollProgress() {
    var bar = document.querySelector(".scroll-progress");
    if (!bar) return;
    var ticking = false;

    function update() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, progress)) + ")";
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Word-by-word hero heading reveal ---------- */
  function initHeroWords() {
    if (PREFERS_REDUCED_MOTION) return;
    var heading = document.querySelector(".hero h1");
    if (!heading) return;

    var words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words
      .map(function (word, i) {
        var delay = (i * 0.07).toFixed(2);
        return (
          '<span class="word-reveal"><span class="word" style="animation-delay:' +
          delay +
          's">' +
          word +
          "</span></span> "
        );
      })
      .join("");
  }

  /* ---------- 3D tilt-on-hover for feature/tier/mural cards ---------- */
  function initTilt() {
    if (PREFERS_REDUCED_MOTION) return;
    var cards = document.querySelectorAll(".feature-card, .tier-card, .mural-card");
    if (!cards.length) return;

    cards.forEach(function (card) {
      var restingLift = card.classList.contains("mural-card") ? "" : "translateY(-8px) ";

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        var rotateY = px * 14;
        var rotateX = py * -14;
        card.style.transform =
          "perspective(900px) " + restingLift + "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.04)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Button ripple on click ---------- */
  function initRipple() {
    if (PREFERS_REDUCED_MOTION) return;
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".btn");
      if (!btn) return;

      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 1.4;
      var ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", function () {
        ripple.remove();
      });
    });
  }

  /* ---------- Navbar scroll state (shrink + shadow past the hero) ---------- */
  function initNavbarScroll() {
    var navbar = document.querySelector(".navbar");
    if (!navbar) return;
    var ticking = false;

    function update() {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Stat number count-up ---------- */
  function initCountUp() {
    var items = document.querySelectorAll(".stat-number");
    if (!items.length) return;

    function animateCount(el) {
      var match = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!match) return;
      var target = parseInt(match[1], 10);
      var suffix = match[2] || "";

      if (PREFERS_REDUCED_MOTION || !("requestAnimationFrame" in window)) {
        el.textContent = target + suffix;
        return;
      }

      var duration = 1200;
      var start = null;
      el.textContent = "0" + suffix;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }
      window.requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      items.forEach(animateCount);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

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
    var cartBtn = document.querySelector(".cart-btn");
    var buttons = document.querySelectorAll("[data-add-to-cart]");
    if (!buttons.length) return;

    var count = 0;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        count += 1;
        if (countEl) {
          countEl.textContent = String(count);
          countEl.style.display = "flex";
          countEl.classList.remove("pop");
          void countEl.offsetWidth; // restart the animation on repeat clicks
          countEl.classList.add("pop");
        }
        if (cartBtn) {
          cartBtn.classList.remove("bump");
          void cartBtn.offsetWidth;
          cartBtn.classList.add("bump");
        }
        var original = btn.textContent;
        btn.textContent = "Added \u2713";
        btn.disabled = true;
        btn.classList.add("added-pop");
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
          btn.classList.remove("added-pop");
        }, 1200);
      });
    });
  }

  /* ---------- Project Filtering ---------- */
  function initFilters() {
    var filterBtns = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".project-card");
    var indicator = document.querySelector(".filter-indicator");
    if (!filterBtns.length) return;

    function moveIndicatorTo(btn) {
      if (!indicator) return;
      indicator.style.width = btn.offsetWidth + "px";
      indicator.style.transform = "translateX(" + btn.offsetLeft + "px)";
    }

    var activeBtn = document.querySelector(".filter-btn.active");
    if (activeBtn) {
      // Position instantly on load (no slide-in from nowhere on first paint).
      if (indicator) indicator.style.transition = "none";
      moveIndicatorTo(activeBtn);
      if (indicator) {
        void indicator.offsetWidth;
        indicator.style.transition = "";
      }
    }
    window.addEventListener("resize", function () {
      var current = document.querySelector(".filter-btn.active");
      if (current) moveIndicatorTo(current);
    });

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        moveIndicatorTo(btn);
        var filter = btn.getAttribute("data-filter");

        cards.forEach(function (card) {
          var cat = card.getAttribute("data-category");
          var show = filter === "all" || cat === filter;

          if (show) {
            card.style.display = "flex";
            // Force reflow so the browser registers the "hidden" starting
            // state before we remove it — otherwise there's nothing to animate.
            void card.offsetWidth;
            card.classList.remove("card-hidden");
          } else {
            card.classList.add("card-hidden");
            setTimeout(function () {
              if (card.classList.contains("card-hidden")) card.style.display = "none";
            }, PREFERS_REDUCED_MOTION ? 0 : 260);
          }
        });
      });
    });
  }

  /* ---------- Shared form submit helper ---------- */
  function submitToFormBackend(form, onDone) {
    if (!FORM_ENDPOINT_CONFIGURED) {
      console.warn(
        "[I Leaf Art] Form backend not configured — this submission was not sent anywhere. " +
        "Set FORM_ENDPOINT in main.js to a real Formspree/Web3Forms endpoint to go live."
      );
      onDone(true);
      return;
    }
    fetch(FORM_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then(function (res) { onDone(res.ok); })
      .catch(function () { onDone(false); });
  }

  /* ---------- Contact Form ---------- */
  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.classList.remove("shake");
        void form.offsetWidth;
        form.classList.add("shake");
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.classList.add("is-loading");

      submitToFormBackend(form, function (ok) {
        if (submitBtn) submitBtn.classList.remove("is-loading");
        var msg = form.querySelector(".form-success");
        if (msg) {
          msg.textContent = ok
            ? "Thank you! Your message has been sent. We'll be in touch soon."
            : "Something went wrong sending your message — please email us directly instead.";
          msg.classList.add("show");
        }
        if (ok) form.reset();
      });
    });
  }

  /* ---------- Newsletter ---------- */
  function initNewsletter() {
    var forms = document.querySelectorAll(".newsletter-form");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.classList.add("is-loading");
        submitToFormBackend(form, function (ok) {
          if (submitBtn) submitBtn.classList.remove("is-loading");
          var input = form.querySelector("input");
          if (input) {
            input.value = "";
            input.placeholder = ok ? "Thank you for subscribing!" : "Something went wrong — try again later";
            if (ok) {
              input.classList.remove("pulse-success");
              void input.offsetWidth;
              input.classList.add("pulse-success");
            }
          }
        });
      });
    });
  }

  /* ---------- Donate Tiers (scroll to bank/OMT fallback until a payment processor is connected) ---------- */
  function initDonateButtons() {
    var buttons = document.querySelectorAll("[data-donate-tier]");
    var customForm = document.querySelector("#custom-amount-form");
    var target = document.querySelector("#give-directly");
    var note = document.querySelector("#donate-note");
    if (!target) return;

    function goToGiveDirectly(amount) {
      if (note) {
        note.textContent = "Online card payment isn't connected yet — here's how to send " +
          (amount ? "$" + amount : "your gift") + " directly.";
        note.style.display = "block";
      }
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(
        function () {
          target.classList.remove("flash-highlight");
          void target.offsetWidth;
          target.classList.add("flash-highlight");
        },
        PREFERS_REDUCED_MOTION ? 0 : 400
      );
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        goToGiveDirectly(btn.getAttribute("data-donate-tier"));
      });
    });

    if (customForm) {
      customForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = document.querySelector("#custom-amount-input");
        goToGiveDirectly(input && input.value ? input.value : null);
      });
    }
  }

  /* ---------- Page Transitions ----------
     This is a multi-page static site (hard navigation between .html files, no router), so we fade the
     current page out via a CSS class before navigating, and every page fades itself in on load (see
     body/.page-leaving animations in style.css). Doesn't touch the .reveal scroll-in system — that's
     per-element and runs independently after each fresh page load. Falls back to instant navigation
     when the user prefers reduced motion, and clears any stuck state on bfcache restore (back/forward). */
  function initPageTransitions() {
    var TRANSITION_MS = 220;

    window.addEventListener("pageshow", function () {
      document.body.classList.remove("page-leaving");
    });

    if (PREFERS_REDUCED_MOTION) return;

    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var link = e.target.closest && e.target.closest("a[href]");
      if (!link) return;

      var hrefAttr = link.getAttribute("href");
      if (!hrefAttr || hrefAttr.indexOf("#") === 0) return; // bare/in-page anchors
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      var url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (err) {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (!/\.html?$/.test(url.pathname)) return; // only intercept page-to-page navigations

      e.preventDefault();
      document.body.classList.add("page-leaving");
      setTimeout(function () {
        window.location.href = link.href;
      }, TRANSITION_MS);
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initHeroWords();
    initMenu();
    initReveal();
    initScrollProgress();
    initNavbarScroll();
    initCountUp();
    initCart();
    initFilters();
    initTilt();
    initRipple();
    initContactForm();
    initNewsletter();
    initDonateButtons();
    initPageTransitions();
  });
})();
