const marketingTimeline = document.querySelector("[data-marketing-timeline]");

if (marketingTimeline) {
  const track = marketingTimeline.querySelector("[data-timeline-track]");
  const cards = Array.from(marketingTimeline.querySelectorAll("[data-timeline-card]"));
  const previousButton = marketingTimeline.querySelector("[data-timeline-previous]");
  const nextButton = marketingTimeline.querySelector("[data-timeline-next]");
  const counter = marketingTimeline.querySelector("[data-timeline-counter]");
  const progress = marketingTimeline.querySelector("[data-timeline-progress]");
  const progressFill = progress?.querySelector("span");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let scrollFrame = 0;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let isDragging = false;

  const clampIndex = (index) => Math.max(0, Math.min(cards.length - 1, index));

  const updateTimeline = (index) => {
    activeIndex = clampIndex(index);

    cards.forEach((card, cardIndex) => {
      const isActive = cardIndex === activeIndex;
      card.classList.toggle("is-active", isActive);
      if (isActive) card.setAttribute("aria-current", "step");
      else card.removeAttribute("aria-current");
    });

    counter.textContent = `Hafta ${activeIndex + 1} / ${cards.length}`;
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === cards.length - 1;
    progress.setAttribute("aria-valuenow", String(activeIndex + 1));
    progressFill.style.setProperty(
      "--timeline-progress",
      `${((activeIndex + 1) / cards.length) * 100}%`
    );
  };

  const scrollToCard = (index) => {
    const nextIndex = clampIndex(index);
    const card = cards[nextIndex];
    const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;

    updateTimeline(nextIndex);
    track.scrollTo({
      left,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  };

  const findClosestCard = () => {
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(trackCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    updateTimeline(closestIndex);
  };

  previousButton.addEventListener("click", () => scrollToCard(activeIndex - 1));
  nextButton.addEventListener("click", () => scrollToCard(activeIndex + 1));

  track.addEventListener("scroll", () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(findClosestCard);
  }, { passive: true });

  track.addEventListener("keydown", (event) => {
    const keyActions = {
      ArrowLeft: activeIndex - 1,
      ArrowRight: activeIndex + 1,
      Home: 0,
      End: cards.length - 1,
    };

    if (!(event.key in keyActions)) return;
    event.preventDefault();
    scrollToCard(keyActions[event.key]);
  });

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    isDragging = true;
    dragStartX = event.clientX;
    dragStartScroll = track.scrollLeft;
    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    track.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
  });

  const stopDragging = (event) => {
    if (!isDragging) return;

    isDragging = false;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    findClosestCard();
    scrollToCard(activeIndex);
  };

  track.addEventListener("pointerup", stopDragging);
  track.addEventListener("pointercancel", stopDragging);

  if ("ResizeObserver" in window) {
    new ResizeObserver(() => scrollToCard(activeIndex)).observe(track);
  }

  updateTimeline(0);
}
