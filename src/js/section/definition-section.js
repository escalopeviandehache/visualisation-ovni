document.addEventListener("DOMContentLoaded", function() {
    const definition = "Voici la définition de l'ovni. Un objet volant non identifié (OVNI) est un terme couramment utilisé pour décrire des phénomènes aériens inexpliqués observés dans le ciel.";
    let index = 0;
    const element = document.getElementById('definition-text');
    
    function typeWriter() {
      if (index < definition.length) {
        element.innerHTML += definition.charAt(index);
        index++;
        setTimeout(typeWriter, 120); // Ajuste la vitesse ici
      }
    }
  
    typeWriter();
  });