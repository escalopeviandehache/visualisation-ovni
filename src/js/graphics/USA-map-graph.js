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
}