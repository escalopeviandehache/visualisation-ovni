import { filmsData } from '../data/films_data';

document.addEventListener('DOMContentLoaded', function () {
    // Récupérer l'ID du film depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const filmId = urlParams.get('film');

    // Trouver le film correspondant dans les données
    let filmTrouve = null;

    // Correspondance entre les IDs et les titres
    const filmMappings = {
        'alien': 'Alien',
        'et': 'E.T. l\'extra-terrestre',
        'laNuitDesExtraterestres': 'La Nuit des extraterrestres',
        'paul': 'Paul',
        'marsAttack': 'Mars Attacks!',
        'starWars': 'Star Wars'
    };

    // Chercher le film par son titre
    if (filmId && filmMappings[filmId]) {
        const filmTitle = filmMappings[filmId];
        filmTrouve = filmsData.films.find(film => film.titre === filmTitle);
    }

    const filmContent = document.getElementById('filmContent');

    if (filmTrouve) {
        // Mettre à jour le title avec le nom du film
        document.title = `${filmTrouve.titre} - Anecdote OVNI`;

        // Construire le HTML avec les informations du film
        let posterPath = `../../img/affiches-film/affiche-film-${filmId}.jpg`;

        let contentHTML = `
            <div class="film-poster-area">
                <img src="${posterPath}" alt="${filmTrouve.titre}" class="film-poster">
            </div>
            
            <div class="film-content">
                <h1 class="film-title">${filmTrouve.titre}</h1>
                <p class="film-year-director">${filmTrouve.annee} - ${filmTrouve.realisateur}</p>
                
                <div class="film-description">
                    ${filmTrouve.description}
                </div>
                
                <a href="../../index.html#anecdote-films" class="back-button">Retour aux films</a>
            </div>
        `;

        filmContent.innerHTML = contentHTML;
    } else {
        // Afficher un message d'erreur si le film n'est pas trouvé
        filmContent.innerHTML = `
            <div class="error-message">
                <h2>Film non trouvé</h2>
                <p>Désolé, nous n'avons pas trouvé d'informations pour ce film.</p>
                <a href="../../index.html#anecdote-films" class="back-button">Retour aux films</a>
            </div>
        `;
    }
});