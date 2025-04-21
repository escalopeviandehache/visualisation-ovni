const phrases = document.querySelectorAll('.phrase');
const hint = document.querySelector('#scrollHint');
let scrolled = false; // Flag pour vérifier si l'utilisateur a déjà scrollé
let phraseIndex = 0; // Index pour suivre quelle phrase doit être affichée
let lastScrollY = 0; // Suivre la position du dernier scroll

// Fonction pour afficher les phrases lors du scroll
function showPhrasesOnScroll() {
  // Vérifier si l'utilisateur scrolle vers le bas (réscroll)
  if (window.scrollY > lastScrollY) {
    // Si l'utilisateur a commencé à scroller, affiche les phrases
    if (!scrolled && window.scrollY > 10) {
      scrolled = true;
      hint.classList.add('hidden'); // Masquer le message de scroll
      hint.innerHTML = '';
    }

    // Afficher la phrase suivante uniquement si l'utilisateur scrolle vers le bas
    if (phraseIndex < phrases.length) {
      const phrase = phrases[phraseIndex];
      if (isElementInViewport(phrase)) {
        phrase.classList.add('visible');
        phraseIndex++; // Passer à la phrase suivante
      }
    }
  }

  // Mettre à jour la position du dernier scroll
  lastScrollY = window.scrollY;
}

// Vérifie si un élément est visible dans la fenêtre
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

// Écouter l'événement scroll
window.addEventListener('scroll', showPhrasesOnScroll);
