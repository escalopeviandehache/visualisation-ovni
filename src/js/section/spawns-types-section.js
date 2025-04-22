gsap.registerPlugin(ScrollTrigger);

const sections2 = gsap.utils.toArray(".apparition-card");

gsap.to(sections2, {
  xPercent: -100 * (sections2.length - 0.5),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-scroll-container",
    pin: true,
    scrub: 1,
    // snap: 1 / (sections.length - 1),
    end: () =>
      "+=" +
      document.querySelector(".horizontal-scroll-container").offsetWidth
  }
});

// après tout, pour s'assurer que ScrollTrigger a bien la bonne taille
ScrollTrigger.refresh();