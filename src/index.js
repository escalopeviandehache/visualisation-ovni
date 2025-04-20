import '/js/data/processed_data.js';

import '/js/section/ufo-type-graph-section.js';
import '/js/section/US-map-section.js';
import '/js/section/testimony-section.js';
import '/js/section/slider-evolution.js';
import '/js/section/movie-details-section.js';
import '/js/section/crop-circles.js';


  const slider = document.querySelector('.slider-container1');
  const btnPrev = document.querySelector('.prev-slide');
  const btnNext = document.querySelector('.next-slide');

  btnPrev.addEventListener('click', () => {
    slider.scrollBy({
      left: -slider.offsetWidth * 0.9,
      behavior: 'smooth'
    });
  });

  btnNext.addEventListener('click', () => {
    slider.scrollBy({
      left: slider.offsetWidth * 0.9,
      behavior: 'smooth'
    });
  });