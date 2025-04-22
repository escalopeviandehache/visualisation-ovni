
gsap.registerPlugin(ScrollTrigger);

const sections = gsap.utils.toArray(".testimony-section");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 0.5),
  ease: "none",
  scrollTrigger: {
    trigger: ".testimony-section-wrapper",
    pin: true,
    scrub: 1,
    // snap: 1 / (sections.length - 1),
    end: () =>
      "+=" +
      document.querySelector(".testimony-section-wrapper").offsetWidth
  }
});

// après tout, pour s'assurer que ScrollTrigger a bien la bonne taille
ScrollTrigger.refresh();