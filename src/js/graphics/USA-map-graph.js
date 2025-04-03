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

    // Ajouter un marqueur pour la Zone 51
    const zone51Marker = L.marker([37.25436354487456, -115.78680345914648]).addTo(mapUSA);

    // Ajouter un popup au marqueur, avec du contenu personnalisé et un style adapté
    zone51Marker.on('click', function() {
        const popupContent = `
            <div class="custom-popup">
                <h3 style="text-align: center; font-size: 1.5rem;">Zone 51</h3>
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Nellis_AFB_Area_51.jpg" alt="Zone 51" style="width: 100%; border-radius: 6px; margin-bottom: 10px;" />
                <p><strong>Location:</strong> Nevada</p>
                <p><strong>Coordinates:</strong> 37.25436354487456, -115.78680345914648</p>
                <p><strong>Description:</strong><br>
                    La Zone 51 est une base militaire ultra-secrète située dans le désert du Nevada, aux États-Unis. Officiellement, il s'agit d'un site d'essais pour des avions et des technologies militaires avancées, mais son existence même est longtemps restée classifiée par le gouvernement américain. Son aura de mystère et son accès strictement interdit ont alimenté de nombreuses théories du complot, notamment sur la présence d'ovnis et de technologies extraterrestres.<br><br>
                    L’association entre la Zone 51 et les extraterrestres remonte aux années 1950 et 1960, en pleine guerre froide, lorsque des témoins ont signalé avoir vu des objets volants non identifiés dans le ciel. En réalité, ces observations étaient souvent liées aux tests d'avions espions comme l'U-2 ou le SR-71 Blackbird, mais la culture populaire s’est rapidement emparée du mythe. L’affaire Roswell a renforcé cette réputation : certains pensent que les débris et les corps supposément extraterrestres récupérés en 1947 y ont été analysés.<br><br>
                    Officiellement, la Zone 51 n’est qu’un site de développement militaire avancé. Officieusement, elle continue d'alimenter les fantasmes sur la vie extraterrestre et les complots gouvernementaux. Vérité cachée ou simple légende urbaine ? Le mystère demeure.
                </p>
            </div>
        `;
    
        // Créer et afficher le popup en bas à gauche
        L.popup({
            closeButton: true,           // Pour ajouter un bouton de fermeture
            className: 'custom-popup'    // Utilisation de la classe CSS personnalisée
        })
        .setLatLng([37.25436354487456, -115.78680345914648])
        .setContent(popupContent)
        .openOn(mapUSA);
    });
}