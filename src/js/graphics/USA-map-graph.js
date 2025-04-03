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

    // Ajouter un marqueur à la Zone 51 avec un popup
    const zone51Coordinates = [37.2350, -115.8100]; // Coordonnées approximatives de la Zone 51
    const zone51Popup = "La Zone 51 - Le mystère extraterrestre..."; // Texte du popup

    // Créer une icône personnalisée avec une couleur
    const customIcon = L.divIcon({
        className: 'custom-icon', // Classe CSS pour l'icône
        html: '<div style="background-color:rgb(6, 85, 25); width: 20px; height: 20px; border-radius: 50%; border: 2px solid #FFFFFF;"></div>', // Cercle rouge avec bordure blanche
        iconSize: [40, 40],  // Taille de l'icône
        iconAnchor: [15, 30], // Point d'ancrage de l'icône
        popupAnchor: [0, -30] // Point d'ancrage du popup
    });

    // Ajouter le marqueur avec l'icône personnalisée
    L.marker(zone51Coordinates, { icon: customIcon })
        .addTo(mapUSA)
        .bindPopup(zone51Popup) // Lier le texte du popup au marqueur
        .openPopup(); // Ouvrir le popup immédiatement (facultatif)
}