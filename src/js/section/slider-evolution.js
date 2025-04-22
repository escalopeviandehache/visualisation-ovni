// document.addEventListener("DOMContentLoaded", () => {
//     const evolutionSlider = document.querySelector(".slider-container-evo");
//     const prevBtn = document.querySelector(".evolution-slider .prev-slide");
//     const nextBtn = document.querySelector(".evolution-slider .next-slide");
  
//     const slides = document.querySelectorAll(".slide-evo");
//     let currentSlide = 0;
  
//     // Fonction pour mettre à jour la position du slider en fonction de l'index courant
//     function updateSliderPosition() {
//       const slideWidth = slides[0].offsetWidth; // Utilise toute la largeur du conteneur pour chaque slide
//       evolutionSlider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
//     }
  
//     // Fonction pour changer la slide active en fonction de la direction
//     function changeSlide(direction) {
//       slides[currentSlide].classList.remove('active'); // Retirer la classe active de la slide actuelle
//       currentSlide = (currentSlide + direction + slides.length) % slides.length; // Calculer la nouvelle slide active
//       slides[currentSlide].classList.add('active'); // Ajouter la classe active à la nouvelle slide
//       updateSliderPosition(); // Mettre à jour la position du slider
//     }
  
//     // Gestion des événements pour les boutons de navigation
//     prevBtn.addEventListener("click", () => changeSlide(-1));
//     nextBtn.addEventListener("click", () => changeSlide(1));
  
//     // Initialiser la première slide comme active et mettre à jour la position
//     slides[currentSlide].classList.add('active');
//     updateSliderPosition();
  
//     // Réajuster la position du slider lors du redimensionnement de la fenêtre
//     window.addEventListener('resize', updateSliderPosition);
//   });


gsap.registerPlugin(ScrollTrigger);

const sections = gsap.utils.toArray(".evolution-section");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 0.5),
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