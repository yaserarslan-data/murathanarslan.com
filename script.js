const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const navGroups = document.querySelectorAll("[data-nav-group]");
const mobileBreakpoint = window.matchMedia("(max-width: 860px)");

const closeNavGroups = ({ returnFocus = false } = {}) => {
  navGroups.forEach((group) => {
    if (!group.open) return;

    group.open = false;
    if (returnFocus) group.querySelector("summary")?.focus();
  });
};

const closeMenu = ({ returnFocus = false } = {}) => {
  if (!header || !navToggle) return;

  header.dataset.menuOpen = "false";
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Menüyü aç");
  document.body.classList.remove("menu-open");
  closeNavGroups();

  if (returnFocus) navToggle.focus();
};

const openMenu = () => {
  if (!header || !navToggle) return;

  header.dataset.menuOpen = "true";
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Menüyü kapat");
  document.body.classList.add("menu-open");
};

if (header && navToggle && navLinks) {
  header.dataset.menuOpen = "false";

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-nav-group]")) closeNavGroups();

    if (
      mobileBreakpoint.matches &&
      navToggle.getAttribute("aria-expanded") === "true" &&
      !header.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const hasOpenGroup = Array.from(navGroups).some((group) => group.open);
    if (hasOpenGroup) closeNavGroups({ returnFocus: true });

    if (navToggle.getAttribute("aria-expanded") === "true") {
      closeMenu({ returnFocus: true });
    }
  });

  const handleBreakpointChange = (event) => {
    if (!event.matches) closeMenu();
  };

  if (typeof mobileBreakpoint.addEventListener === "function") {
    mobileBreakpoint.addEventListener("change", handleBreakpointChange);
  } else {
    mobileBreakpoint.addListener(handleBreakpointChange);
  }
}

navGroups.forEach((group) => {
  group.addEventListener("toggle", () => {
    if (!group.open) return;

    navGroups.forEach((otherGroup) => {
      if (otherGroup !== group) otherGroup.open = false;
    });
  });
});

if (header) {
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const revealElements = document.querySelectorAll(".reveal");

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.remove("reveal-pending");
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08,
    }
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal-pending");
    revealObserver.observe(element);
  });
}
