// document.addEventListener("DOMContentLoaded", () => {
//     const slides = document.querySelectorAll(".slide");
//     const nextBtn = document.querySelector(".next-slide");
//     const prevBtn = document.querySelector(".prev-slide");
  
//     let currentSlide = 0;
  
//     function showSlide(index) {
//       slides.forEach((slide, i) => {
//         slide.classList.remove("active");
//         slide.style.left = "100%";
//         if (i === index) {
//           slide.classList.add("active");
//           slide.style.left = "0";
//         }
//       });
//     }
  
//     nextBtn.addEventListener("click", () => {
//       currentSlide = (currentSlide + 1) % slides.length;
//       showSlide(currentSlide);
//     });
  
//     prevBtn.addEventListener("click", () => {
//       currentSlide = (currentSlide - 1 + slides.length) % slides.length;
//       showSlide(currentSlide);
//     });
  
//     // Initial display
//     showSlide(currentSlide);
//   });
// horizontal scroll avec GSAP ScrollTrigger
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