import csvData from '../../../public/data/complete.csv'; // Import du fichier CSV

export default function initializeUSAMap() {
    console.log("Initialisation de la carte...");
    const mapUSA = L.map('heatmap-usa', { scrollWheelZoom: false, touchZoom: true }).setView([37.7749, -119.4194], 5);
    console.log("Carte créée avec succès !");

    // désactiver le zoom au scroll
    mapUSA.scrollWheelZoom.disable();
    // activer le zoom au pinch
    mapUSA.touchZoom.enable();

    // gestion du pinch
    let activePointers = [];
    let initialDistance = null;

    function getDistance(a, b) {
        const dx = a.clientX - b.clientX;
        const dy = a.clientY - b.clientY;
        return Math.hypot(dx, dy);
    }

    const container = mapUSA.getContainer();
    container.style.touchAction = 'none';

    container.addEventListener('pointerdown', function(e) {
        activePointers.push(e);
    });

    container.addEventListener('pointermove', function(e) {
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

    window.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
            mapUSA.scrollWheelZoom.enable();
            mapUSA._onWheelScroll(e);
            setTimeout(() => mapUSA.scrollWheelZoom.disable(), 0);
        }
    }, { passive: false });

    // ajouter les styles dynamiques
    const style = document.createElement('style');
    style.innerHTML = `
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
        .aides-user-map {
            font-family: Orbitron, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            font-size: 1.5em;
            color: white;
            opacity: 1;
            transition: opacity 1s ease-in-out, transform 1s ease;
            z-index: 1000;
            pointer-events: none;
            animation: pulse 2s infinite;
            padding: 15px 25px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }
        .aides-user-map.hidden {
            opacity: 0;
            visibility: hidden;
        }
        @keyframes pulse {
            0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 0.8;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.1);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 0.8;
            }
        }
    `;
    document.head.appendChild(style);

    // créer dynamiquement le message aides-user-map
    const hintDiv = document.createElement('p');
    hintDiv.className = 'aides-user-map';
    hintDiv.id = 'aides-user-map';
    hintDiv.innerText = 'Explore la carte et clique sur l\'ovni pour plus d\'infos sur la mystérieuse Zone 51 !';
    mapUSA.getContainer().appendChild(hintDiv);

    // fonction pour cacher le hint au premier mouvement
    function hideHint() {
        const hint = document.getElementById('aides-user-map');
        if (hint) {
            hint.classList.add('hidden');
        }
        mapUSA.off('movestart', hideHint);
        mapUSA.off('zoomstart', hideHint);
        mapUSA.off('dragstart', hideHint);
    }

    // écouter les mouvements
    mapUSA.on('movestart', hideHint);
    mapUSA.on('zoomstart', hideHint);
    mapUSA.on('dragstart', hideHint);

    // ajouter la carte sombre
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors, &copy; CartoDB',
    }).addTo(mapUSA);

    // préparer les données heatmap
    const heatData = csvData
        // .filter(row => row.country === 'us') // Ne garder que les entrées avec country == 'us'
        .map(row => {
            const lat = parseFloat(row.latitude);
            const lon = parseFloat(row.longitude);
            const intensity = 0.5;
            if (!isNaN(lat) && !isNaN(lon)) {
                return [lat, lon, intensity];
            }
        })
        .filter(item => item);

    const gradient = {
        0.0: '#00441b',
        0.2: '#006d2c',
        0.4: '#238845',
        0.6: '#41ab5d',
        0.8: '#74c476',
        0.9: '#a1d998',
        1.0: '#c7e9c0'
    };

    L.heatLayer(heatData, {
        radius: 20,
        blur: 15,
        maxZoom: 10,
        gradient: gradient
    }).addTo(mapUSA);

    // ajouter la zone 51
    const zone51Icon = L.icon({
        iconUrl: '../../img/ovni-pin.png',
        iconSize: [75, 75],
        iconAnchor: [37, 75],
        popupAnchor: [0, -70]
    });

    const zone51Marker = L.marker([37.25436354487456, -115.78680345914648], { icon: zone51Icon }).addTo(mapUSA);

    zone51Marker.on('click', function () {
        const popupContent = `
            <button class="close-popup-button">X</button>
            <div class="popup-content">
                <div class="popup-top">
                    <div class="popup-image">
                        <img src="../../img/spawns-types/area51.webp" alt="Zone 51" /><br>
                        <img src="../../img/alienZone51.jpg" alt="Zone 51" />
                    </div>
                    <div class="popup-text">
                        <h3 id="titre-popup">Zone 51</h3>
                        <p><strong>Location:</strong> Nevada <br><strong>Coordinates:</strong> 37.25436354487456, -115.78680345914648</p>
                         <p>
                            La Zone 51 est une base militaire ultra-secrète située dans le désert du Nevada, aux États-Unis. Officiellement, il s'agit d'un site d'essais pour des avions et des technologies militaires avancés, mais son existence même est longtemps restée classifiée par le gouvernement américain. Son aura de mystère et son accès strictement interdit ont alimenté de nombreuses théories du complot, notamment sur la présence d'ovnis et de technologies extraterrestres.
                        </p>
                        <p>
                            Officiellement, la Zone 51 n’est qu’un site de développement militaire avancé. Officieusement, elle continue d'alimenter les fantasmes sur la vie extraterrestre et les complots gouvernementaux. 
                        </p>
                        <p>
                            <strong id="text-vert">Vérité cachée ou simple légende urbaine ? Le mystère demeure...</strong>                        
                        </p>
                </div>
            </div>
        `;
        const popupContainer = document.getElementById('popup-container');
        popupContainer.querySelector('.custom-popup').innerHTML = popupContent;
        popupContainer.classList.remove('hidden');

        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.classList.add('no-scroll');

        document.querySelector('.close-popup-button').addEventListener('click', function () {
            popupContainer.classList.add('hidden');
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.classList.remove('no-scroll');
            window.scrollTo(0, scrollY);
        });
    });

    document.getElementById('popup-container').addEventListener('click', function (e) {
        if (e.target.id === 'popup-container') {
            this.classList.add('hidden');
            const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10));
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.classList.remove('no-scroll');
            window.scrollTo(0, scrollY);
        }
    });
}