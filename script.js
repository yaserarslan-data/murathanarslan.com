const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

document.querySelectorAll("[data-scroll]").forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.scroll;
    document.querySelector(target)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});
