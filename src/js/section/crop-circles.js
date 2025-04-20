document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.3 } // Déclenche lorsque 20% de la section est visible
  );

  // Sélectionner les éléments à animer
  const elementsToAnimate = document.querySelectorAll(
    "#crop-circles p, #crop-circles img"
  );

  elementsToAnimate.forEach((el) => observer.observe(el));
});