


gsap.registerPlugin(ScrollTrigger);

const sections1 = gsap.utils.toArray(".evolution-section");

gsap.to(sections1, {
  xPercent: -100 * (sections1.length - 0.5),
  ease: "none",
  scrollTrigger: {
    trigger: ".evolution-section-wrapper",
    pin: true,
    scrub: 1,
    // snap: 1 / (sections.length - 1),
    end: () =>
      "+=" +
      document.querySelector(".evolution-section-wrapper").offsetWidth
  }
});

// après tout, pour s'assurer que ScrollTrigger a bien la bonne taille
ScrollTrigger.refresh();