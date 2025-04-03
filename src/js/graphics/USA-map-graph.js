export default function initializeUSAMap() {
    console.log("Initialisation de la carte...");
    const mapUSA = L.map('heatmap-usa').setView([37.7749, -119.4194], 5);
    console.log("Carte créée avec succès !");

    // Ajoute OpenStreetMap comme fond de carte
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapUSA);

    // Données de la heatmap
    const heatData = [
        [37.7749, -122.4194, 0.5], // San Francisco
        [34.0522, -118.2437, 0.8], // Los Angeles
        [40.7128, -74.0060, 0.9]  // New York
    ];

    // Ajout de la heatmap à la carte
    L.heatLayer(heatData, {
        radius: 20,
        blur: 15,
        maxZoom: 10
    }).addTo(mapUSA);
}

