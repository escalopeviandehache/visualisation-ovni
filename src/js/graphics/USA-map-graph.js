import csvData from '../../../public/data/complete.csv'; // Import du fichier CSV

export default function initializeUSAMap() {
    console.log("Initialisation de la carte...");
    const mapUSA = L.map('heatmap-usa').setView([37.7749, -119.4194], 5); // Vue centrée sur les États-Unis
    console.log("Carte créée avec succès !");

    // Ajoute une carte avec un style sombre
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors, &copy; CartoDB',
    }).addTo(mapUSA);

    // Filtrer les données CSV pour ne conserver que celles des États-Unis
    const heatData = csvData
        .filter(row => row.country === 'us') // Ne garder que les entrées avec country == 'us'
        .map(row => {
            const lat = parseFloat(row.latitude);
            const lon = parseFloat(row.longitude);
            const intensity = 0.5; // Définir l'intensité ou ajuster selon vos besoins
            
            // Vérifier que la latitude et la longitude sont valides
            if (!isNaN(lat) && !isNaN(lon)) {
                return [lat, lon, intensity]; // Formater les données pour la heatmap
            }
        })
        .filter(item => item);  // Filtrer les éléments invalides

    // Définir un dégradé personnalisé pour la heatmap
    const gradient = {
        0.0: '#00FF00',    // Faible intensité = vert fluo
        0.3: '#33FF33',    // Intensité faible à moyenne = vert plus clair
        0.5: '#66FF66',    // Intensité moyenne = vert phosphorescent
        0.7: '#99FF99',    // Intensité moyenne à élevée = vert acide
        0.85: '#00FF99',   // Intensité élevée = vert néon
        1.0: '#33FF99'     // Très forte intensité = vert électrique
    };

    // Ajout de la heatmap avec un gradient personnalisé à la carte
    L.heatLayer(heatData, {
        radius: 20,
        blur: 15,
        maxZoom: 10,
        gradient: gradient   // Appliquer le dégradé
    }).addTo(mapUSA);

    // Modifier la création du popup pour inclure du HTML personnalisé
    const zone51Coordinates = [37.2350, -115.8100]; // Coordonnées approximatives de la Zone 51
    const zone51Popup = `
        <div class="card">
    <div class="movie">
        <h2>Zone 51</h2>
        <img src="https://yourimageurl.com/zone51.jpg" alt="Zone 51" class="movie-poster" />
        <div class="info">
            <h3 class="title">Nevada</h3>
            <p class="prod">
                <span class="release-year">37.25436354487456, -115.78680345914648</span>
            </p>
            <p class="synopsis">
                La Zone 51 est une base militaire ultra-secrète située dans le désert du Nevada, aux États-Unis. Officiellement, il s'agit d'un site d'essais pour des avions et des technologies militaires avancées, mais son existence même est longtemps restée classifiée par le gouvernement américain. Son aura de mystère et son accès strictement interdit ont alimenté de nombreuses théories du complot, notamment sur la présence d'ovnis et de technologies extraterrestres.
            </p>
            <p class="synopsis">
                L’association entre la Zone 51 et les extraterrestres remonte aux années 1950 et 1960, en pleine guerre froide, lorsque des témoins ont signalé avoir vu des objets volants non identifiés dans le ciel. En réalité, ces observations étaient souvent liées aux tests d'avions espions comme l'U-2 ou le SR-71 Blackbird, mais la culture populaire s’est rapidement emparée du mythe. L’affaire Roswell a renforcé cette réputation : certains pensent que les débris et les corps supposément extraterrestres récupérés en 1947 y ont été analysés.
            </p>
            <p class="synopsis">
                Officiellement, la Zone 51 n’est qu’un site de développement militaire avancé. Officieusement, elle continue d'alimenter les fantasmes sur la vie extraterrestre et les complots gouvernementaux. Vérité cachée ou simple légende urbaine ? Le mystère demeure.
            </p>
        </div>
    </div>
</div>
    `;

    // Créer une icône personnalisée avec une couleur
    const customIcon = L.divIcon({
        className: 'custom-icon', // Classe CSS pour l'icône
        html: '<div style="background-color:rgb(6, 85, 25); width: 20px; height: 20px; border-radius: 50%; border: 2px solid #FFFFFF;"></div>', // Cercle rouge avec bordure blanche
        iconSize: [40, 40],  // Taille de l'icône
        iconAnchor: [15, 30], // Point d'ancrage de l'icône
        popupAnchor: [0, -30] // Point d'ancrage du popup
    });

    // Ajouter le marqueur avec l'icône personnalisée et le popup modifié
    L.marker(zone51Coordinates, { icon: customIcon })
        .addTo(mapUSA)
        .bindPopup(zone51Popup) // Lier le texte du popup au marqueur
        .openPopup(); // Ouvrir le popup immédiatement (facultatif)
}

