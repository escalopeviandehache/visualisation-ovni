import csvData from '../../../public/data/complete.csv'; // Import du fichier CSV

export default function initializeUSAMap() {
    console.log("Initialisation de la carte...");
    const mapUSA = L.map('heatmap-usa', { scrollWheelZoom: false, touchZoom: true }).setView([37.7749, -119.4194], 5); // Vue centrée sur les États-Unis
    console.log("Carte créée avec succès !");
    // désactiver le zoom au scroll de la souris
    mapUSA.scrollWheelZoom.disable();
    // activer le zoom au trackpad (pinch)
    mapUSA.touchZoom.enable();
    // gestion du pinch via Pointer Events
    let activePointers = [];
    let initialDistance = null;

    function getDistance(a, b) {
        const dx = a.clientX - b.clientX;
        const dy = a.clientY - b.clientY;
        return Math.hypot(dx, dy);
    }

    const container = mapUSA.getContainer();
    container.style.touchAction = 'none'; // autoriser les gestures

    container.addEventListener('pointerdown', function(e) {
        activePointers.push(e);
    });

    container.addEventListener('pointermove', function(e) {
        // mettre à jour le pointeur actif
        const idx = activePointers.findIndex(p => p.pointerId === e.pointerId);
        if (idx !== -1) {
            activePointers[idx] = e;
        }
        if (activePointers.length === 2) {
            const [p1, p2] = activePointers;
            const dist = getDistance(p1, p2);
            if (initialDistance !== null) {
                const scale = dist / initialDistance;
                const deltaZoom = Math.log2(scale);
                // zoom autour du centre des deux doigts
                const center = [
                    (p1.clientX + p2.clientX) / 2,
                    (p1.clientY + p2.clientY) / 2
                ];
                mapUSA.setZoomAround(container, mapUSA.getZoom() + deltaZoom);
                initialDistance = dist;
            } else {
                initialDistance = dist;
            }
        }
    });

    ['pointerup', 'pointercancel'].forEach(evt =>
        container.addEventListener(evt, function(e) {
            activePointers = activePointers.filter(p => p.pointerId !== e.pointerId);
            if (activePointers.length < 2) {
                initialDistance = null;
            }
        })
    );
    // utiliser window listener avec passive: false pour détecter le pinch trackpad
    window.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
            // activer temporairement le zoom au scroll pour pinch
            mapUSA.scrollWheelZoom.enable();
            mapUSA._onWheelScroll(e);
            // ré-désactiver immédiatement après
            setTimeout(() => mapUSA.scrollWheelZoom.disable(), 0);
        }
    }, { passive: false });
    // ajouter les styles pour les instructions de zoom
    const style = document.createElement('style');
    style.innerHTML = `
      /* permettre le scroll page vertical et le pinch sur la carte */
      #heatmap-usa {
          touch-action: pan-y pinch-zoom;
      }
      .zoom-instructions {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          font-family: sans-serif;
          z-index: 1000;
      }
    `;
    document.head.appendChild(style);
    // // créer et ajouter l'overlay d'instructions de zoom
    // const instructionDiv = L.DomUtil.create('div', 'zoom-instructions');
    // instructionDiv.innerHTML = 'utilisez les boutons +/- ou le trackpad pour zoomer';
    // mapUSA.getContainer().appendChild(instructionDiv);

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
        0.0: '#00441b',    // Faible intensité = vert foncé
        0.2: '#006d2c',    // Intensité faible à moyenne = vert forêt
        0.4: '#238845',    // Intensité moyenne = vert vif
        0.6: '#41ab5d',    // Intensité moyenne à élevée = vert clair
        0.8: '#74c476',    // Intensité élevée = vert tendre
        0.9: '#a1d998',    // Très forte intensité = vert pastel
        1.0: '#c7e9c0'     // Intensité maximale = vert pâle
    };

    // Dégradé alternatif avec des couleurs plus vives
    // const gradient = {
    //     0.0: '#000000',    // Faible intensité = noir
    //     0.2: '#ff0000',    // Intensité faible à moyenne = rouge
    //     0.4: '#ff7f00',    // Intensité moyenne = orange
    //     0.6: '#ffff00',    // Intensité moyenne à élevée = jaune
    //     0.8: '#7fff00',    // Intensité élevée = vert clair
    //     0.9: '#00ff00',    // Très forte intensité = vert vif
    //     1.0: '#00ffff'     // Intensité maximale = cyan
    // };


    // Ajout de la heatmap avec un gradient personnalisé à la carte
    L.heatLayer(heatData, {
        radius: 20,
        blur: 15,
        maxZoom: 10,
        gradient: gradient   // Appliquer le dégradé
    }).addTo(mapUSA);

    // Ajouter un marqueur pour la Zone 51
    const zone51Icon = L.icon({
        iconUrl: '../../img/ovni-pin.png', // Chemin vers l'icône personnalisée
        iconSize: [75, 75], // Taille de l'icône
        iconAnchor: [37, 75], // Point d'ancrage de l'icône (au centre en bas)
        popupAnchor: [0, -70] // Point d'ancrage du popup par rapport à l'icône (en bas au centre)
    });

    const zone51Marker = L.marker([37.25436354487456, -115.78680345914648], { icon: zone51Icon }).addTo(mapUSA);

    // Ajouter un popup au marqueur, avec du contenu personnalisé et un style adapté
    zone51Marker.on('click', function () {
        const popupContent = `
            <button class="close-popup-button">X</button>
            <div class="popup-image-overlay">
                <h3 class="popup-title-top-left">Zone 51</h3>
                <img src="../../img/spawns-types/area51.webp" alt="Zone 51" />
            </div>
            <p><strong>Location:</strong> Nevada</p>
            <p><strong>Coordinates:</strong> 37.25436354487456, -115.78680345914648</p>
            <p><strong>Description:</strong><br>
                La Zone 51 est une base militaire ultra-secrète située dans le désert du Nevada, aux États-Unis. Officiellement, il s'agit d'un site d'essais pour des avions et des technologies militaires avancés, mais son existence même est longtemps restée classifiée par le gouvernement américain. Son aura de mystère et son accès strictement interdit ont alimenté de nombreuses théories du complot, notamment sur la présence d'ovnis et de technologies extraterrestres.<br><br>
                L’association entre la Zone 51 et les extraterrestres remonte aux années 1950 et 1960, en pleine guerre froide, lorsque des témoins ont signalé avoir vu des objets volants non identifiés dans le ciel. En réalité, ces observations étaient souvent liées aux tests d'avions espions comme l'U-2 ou le SR-71 Blackbird, mais la culture populaire s’est rapidement emparée du mythe. L’affaire Roswell a renforcé cette réputation : certains pensent que les débris et les corps supposément extraterrestres récupérés en 1947 y ont été analysés.<br><br>
                Officiellement, la Zone 51 n’est qu’un site de développement militaire avancé. Officieusement, elle continue d'alimenter les fantasmes sur la vie extraterrestre et les complots gouvernementaux. Vérité cachée ou simple légende urbaine ? Le mystère demeure.
            </p>
        `;

        // Sauvegarder la position actuelle de défilement
        const scrollY = window.scrollY;

        // Injecter le contenu dans le conteneur HTML
        const popupContainer = document.getElementById('popup-container');
        popupContainer.querySelector('.custom-popup').innerHTML = popupContent;

        // Afficher le conteneur
        popupContainer.classList.remove('hidden');

        // Désactiver le défilement du reste du site tout en conservant la position
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.classList.add('no-scroll');

        // Ajouter un événement pour fermer le popup via le bouton
        document.querySelector('.close-popup-button').addEventListener('click', function () {
            popupContainer.classList.add('hidden');

            // Réactiver le défilement et restaurer la position
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.classList.remove('no-scroll');
            window.scrollTo(0, scrollY); // Restaurer la position de défilement
        });
    });

    // Ajouter un événement pour fermer le popup en cliquant en dehors
    document.getElementById('popup-container').addEventListener('click', function (e) {
        if (e.target.id === 'popup-container') {
            this.classList.add('hidden');

            // Réactiver le défilement et restaurer la position
            const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10));
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.classList.remove('no-scroll');
            window.scrollTo(0, scrollY); // Restaurer la position de défilement
        }
    });
}