// Importation des bibliothèques nécessaires
import * as d3 from 'd3';
import scrollama from 'scrollama';

const CSV_PATH = 'complete.csv';

// Configuration
const config = {
  margin: { top: 70, right: 60, bottom: 60, left: 80 },
  width: 800,
  height: 500,
  yearStart: 1950,
  yearEnd: 2015,
  colors: {
    primary: '#27fb6b',    // Vert alien
    secondary: '#9c27fb',  // Violet
    background: '#0a0e17', // Fond sombre
    text: '#e4ffe6',       // Texte clair verdâtre
    highlight: '#ff5722'   // Orange pour les points importants
  }
};

// Variables globales
let data;
let svg;
let timelineYears = [];
let currentYearIndex = 0;

// Fonction principale
async function init() {
  try {
    // Ajout d'un effet de chargement
    const loadingElement = d3.select('body')
      .append('div')
      .attr('class', 'loading')
      .style('position', 'fixed')
      .style('top', '0')
      .style('left', '0')
      .style('width', '100%')
      .style('height', '100%')
      .style('background-color', config.colors.background)
      .style('display', 'flex')
      .style('justify-content', 'center')
      .style('align-items', 'center')
      .style('z-index', '1000')
      .style('color', config.colors.primary)
      .style('font-family', "'Orbitron', sans-serif")
      .style('font-size', '24px')
      .html(`
        <div style="text-align: center;">
          <div style="margin-bottom: 20px;">Chargement des données OVNI...</div>
          <div class="spinner" style="
            width: 50px;
            height: 50px;
            border: 5px solid rgba(39, 251, 107, 0.3);
            border-radius: 50%;
            border-top-color: ${config.colors.primary};
            margin: 0 auto;
            animation: spin 1s ease-in-out infinite;
          "></div>
        </div>
      `);

    // Ajouter l'animation
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `, styleSheet.cssRules.length);

    // Chargement des données avec fetch
    const response = await fetch(CSV_PATH);
    if (!response.ok) {
      throw new Error(`Impossible de charger le fichier CSV (statut: ${response.status})`);
    }
    
    const csvText = await response.text();
    data = d3.csvParse(csvText);
    
    // Vérification des colonnes disponibles
    console.log("Colonnes disponibles:", Object.keys(data[0]));
    
    // Filtrer les données pour n'avoir que les observations de 1950 à aujourd'hui
    data = data.filter(d => {
      if (!d.datetime) {
        return false;
      }
      
      try {
        const year = new Date(d.datetime).getFullYear();
        return year && !isNaN(year) && year >= config.yearStart && year <= config.yearEnd;
      } catch (e) {
        console.warn("Date invalide:", d.datetime);
        return false;
      }
    });
    
    // Convertir les dates
    data.forEach(d => {
      try {
        d.date = new Date(d.datetime);
        d.year = d.date.getFullYear();
      } catch (e) {
        console.warn("Impossible de convertir la date:", d.datetime);
      }
    });

    // Générer les années pour le timeline
    for (let year = config.yearStart; year <= config.yearEnd; year += 5) {
      timelineYears.push(year);
    }
    
    // Retirer l'écran de chargement
    loadingElement.remove();
    
    // Mise en place de la structure HTML
    setupDOM();
    
    // Créer la visualisation
    setupVisualization();
    
    // Configurer Scrollama
    setupScrollama();
    
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
    document.body.innerHTML = `
      <div style="color: ${config.colors.highlight}; padding: 20px; font-family: 'Orbitron', sans-serif; text-align: center; height: 100vh; display: flex; align-items: center; justify-content: center; background: ${config.colors.background};">
        <div>
          <h2 style="font-size: 28px; margin-bottom: 20px;">Erreur lors du chargement des données</h2>
          <p style="font-size: 18px; margin-bottom: 15px;">${error.message}</p>
          <p style="font-size: 16px;">Vérifiez la console pour plus de détails.</p>
          <p style="font-size: 16px; margin-top: 15px;">Assurez-vous que le fichier CSV est accessible à l'emplacement: ${CSV_PATH}</p>
          <button onclick="location.reload()" style="
            margin-top: 30px;
            padding: 10px 20px;
            background: transparent;
            border: 2px solid ${config.colors.primary};
            color: ${config.colors.primary};
            font-family: 'Orbitron', sans-serif;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
          ">Réessayer</button>
        </div>
      </div>
    `;
  }
}

// Configuration de la structure DOM
function setupDOM() {
  // Conteneur principal
  const container = d3.select('body')
    .append('div')
    .attr('class', 'scroll-container')
    .style('display', 'flex');
  
  // Panneau de gauche pour le timeline
  const timelinePanel = container.append('div')
    .attr('class', 'timeline-panel')
    .style('width', '30%')
    .style('padding', '20px');
  
  // Titre de la timeline
  timelinePanel.append('h1')
    .style('font-family', "'Orbitron', sans-serif")
    .style('color', config.colors.primary)
    .style('text-align', 'center')
    .style('margin-bottom', '30px')
    .style('font-size', '24px')
    .style('text-shadow', `0 0 10px ${config.colors.primary}`)
    .text('CHRONOLOGIE DES OBSERVATIONS');
  
  // Générer les éléments de scroll pour chaque année
  const scrollSteps = timelinePanel.append('div')
    .attr('class', 'scroll-steps');

  timelineYears.forEach(year => {
    scrollSteps.append('div')
      .attr('class', 'step')
      .attr('data-year', year)
      .html(`
        <div class="year-container">
          <h2>${year}</h2>
          <p>Observations d'OVNI en ${year}</p>
        </div>
      `);
  });
  
  // Panneau central pour la visualisation
  const vizPanel = container.append('div')
    .attr('class', 'viz-panel')
    .style('width', '70%')
    .style('position', 'sticky')
    .style('top', '0')
    .style('height', '100vh')
    .style('display', 'flex')
    .style('align-items', 'center')
    .style('justify-content', 'center')
    .style('flex-direction', 'column');
  
  // Titre principal
  vizPanel.append('h1')
    .style('font-family', "'Orbitron', sans-serif")
    .style('color', config.colors.primary)
    .style('margin-bottom', '20px')
    .style('font-size', '32px')
    .style('text-shadow', `0 0 15px ${config.colors.primary}`)
    .text('ACTIVITÉ OVNI MONDIALE');
  
  // SVG pour la visualisation
  svg = vizPanel.append('svg')
    .attr('width', config.width)
    .attr('height', config.height);

  // Ajouter un effet de grille futuriste en arrière-plan du SVG
  const defs = svg.append('defs');
  
  // Motif de grille
  const pattern = defs.append('pattern')
    .attr('id', 'grid')
    .attr('width', 30)
    .attr('height', 30)
    .attr('patternUnits', 'userSpaceOnUse');
  
  // Lignes horizontales et verticales
  pattern.append('path')
    .attr('d', 'M 30 0 L 0 0 0 30')
    .attr('fill', 'none')
    .attr('stroke', config.colors.primary)
    .attr('stroke-width', 0.2);
  
  // Rectangle en arrière-plan avec le motif de grille
  svg.append('rect')
    .attr('width', config.width)
    .attr('height', config.height)
    .attr('fill', 'url(#grid)')
    .attr('opacity', 0.1);
}

// Configuration de la visualisation D3
function setupVisualization() {
  // Groupement par année
  const countsByYear = d3.rollup(data, v => v.length, d => d.year);
  
  // Conversion en tableau pour D3
  const yearCounts = Array.from(countsByYear, ([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
  
  // Échelles
  const xScale = d3.scaleLinear()
    .domain([config.yearStart, config.yearEnd])
    .range([config.margin.left, config.width - config.margin.right]);
  
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(yearCounts, d => d.count) * 1.1]) // 10% de marge en haut
    .range([config.height - config.margin.bottom, config.margin.top]);
  
  // Axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"))
    .ticks(15);
  
  const yAxis = d3.axisLeft(yScale);
  
  // Ligne de grille horizontale
  svg.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${config.height - config.margin.bottom})`)
    .call(
      d3.axisBottom(xScale)
        .tickSize(-(config.height - config.margin.top - config.margin.bottom))
        .tickFormat('')
        .ticks(10)
    )
    .selectAll('line')
    .style('stroke', config.colors.primary)
    .style('stroke-opacity', 0.1);
  
  // Ligne de grille verticale
  svg.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(${config.margin.left},0)`)
    .call(
      d3.axisLeft(yScale)
        .tickSize(-(config.width - config.margin.left - config.margin.right))
        .tickFormat('')
        .ticks(10)
    )
    .selectAll('line')
    .style('stroke', config.colors.primary)
    .style('stroke-opacity', 0.1);
  
  // Ajouter les axes
  svg.append("g")
    .attr("transform", `translate(0,${config.height - config.margin.bottom})`)
    .call(xAxis)
    .attr('class', 'x-axis');
  
  svg.append("g")
    .attr("transform", `translate(${config.margin.left},0)`)
    .call(yAxis)
    .attr('class', 'y-axis');
  
  // Titres des axes
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", config.width / 2)
    .attr("y", config.height - 15)
    .text("ANNÉE")
    .style("fill", config.colors.text)
    .style("font-size", "14px")
    .style("font-family", "'Orbitron', sans-serif");

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `rotate(-90)`)
    .attr("x", -(config.height / 2))
    .attr("y", 25)
    .text("NOMBRE D'OBSERVATIONS")
    .style("fill", config.colors.text)
    .style("font-size", "14px")
    .style("font-family", "'Orbitron', sans-serif");
  
  // Créer un gradient pour la ligne
  const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");
    
  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", config.colors.secondary);
    
  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", config.colors.primary);
  
  // Ligne pour représenter l'évolution des observations
  const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.count))
    .curve(d3.curveMonotoneX);
  
  // Ajouter la ligne au SVG avec effet de brillance
  const path = svg.append("path")
    .datum(yearCounts)
    .attr("fill", "none")
    .attr("stroke", "url(#line-gradient)")
    .attr("stroke-width", 3)
    .attr("d", line)
    .style("filter", "drop-shadow(0 0 5px rgba(39, 251, 107, 0.7))");
    
  // Ajouter une zone remplie sous la ligne
  const area = d3.area()
    .x(d => xScale(d.year))
    .y0(config.height - config.margin.bottom)
    .y1(d => yScale(d.count))
    .curve(d3.curveMonotoneX);
    
  svg.append("path")
    .datum(yearCounts)
    .attr("fill", "url(#line-gradient)")
    .attr("fill-opacity", 0.1)
    .attr("d", area);
  
  // Lignes verticales et points pour mettre en évidence les années
  const highlightGroup = svg.append('g').attr('class', 'highlights');
  
  // Texte pour les informations
  svg.append('text')
    .attr('class', 'year-title')
    .attr('x', config.width / 2)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .style('font-size', '24px')
    .style('font-weight', 'bold')
    .text('OBSERVATIONS D\'OVNI');
  
  // Fonction pour mettre à jour la visualisation selon l'année
  window.updateVisualization = function(year) {
    // Trouver l'entrée correspondant à l'année
    const yearData = yearCounts.find(d => d.year == year) || { year, count: 0 };
    
    // Supprimer les éléments précédents
    highlightGroup.selectAll('*').remove();
    
    // Ajouter ligne verticale pour l'année en cours
    highlightGroup.append('line')
      .attr('x1', xScale(year))
      .attr('y1', config.margin.top)
      .attr('x2', xScale(year))
      .attr('y2', config.height - config.margin.bottom)
      .attr('stroke', config.colors.secondary)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .style('filter', 'drop-shadow(0 0 3px rgba(156, 39, 251, 0.7))');
    
    // Ajouter point pour l'année en cours
    highlightGroup.append('circle')
      .attr('cx', xScale(year))
      .attr('cy', yScale(yearData.count))
      .attr('r', 8)
      .attr('fill', config.colors.secondary)
      .style('filter', 'drop-shadow(0 0 5px rgba(156, 39, 251, 0.7))')
      .style('opacity', 0)
      .transition()
      .duration(300)
      .style('opacity', 1)
      .attr('r', 8);
    
    // Ajouter un cercle externe avec animation pulsante
    const pulseCircle = highlightGroup.append('circle')
      .attr('cx', xScale(year))
      .attr('cy', yScale(yearData.count))
      .attr('r', 8)
      .attr('fill', 'none')
      .attr('stroke', config.colors.secondary)
      .attr('stroke-width', 2)
      .style('opacity', 1);
    
    // Animation pulsante
    function pulse() {
      pulseCircle
        .transition()
        .duration(1500)
        .attr('r', 20)
        .style('opacity', 0)
        .on('end', function() {
          d3.select(this)
            .attr('r', 8)
            .style('opacity', 1)
            .transition()
            .duration(500)
            .on('end', pulse);
        });
    }
    
    pulse();
    
    // Ajouter texte d'information avec fond
    const textBackground = highlightGroup.append('rect')
      .attr('x', xScale(year) - 80)
      .attr('y', yScale(yearData.count) - 45)
      .attr('width', 160)
      .attr('height', 30)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', config.colors.background)
      .attr('stroke', config.colors.primary)
      .attr('stroke-width', 1)
      .attr('opacity', 0.8);
    
    highlightGroup.append('text')
      .attr('x', xScale(year))
      .attr('y', yScale(yearData.count) - 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-family', "'Orbitron', sans-serif")
      .style('fill', config.colors.primary)
      .text(`${yearData.count} OBSERVATIONS EN ${year}`);
    
    // Mettre à jour le titre principal avec l'année active
    d3.select('.year-title')
      .text(`OBSERVATIONS D'OVNI EN ${year}`);
  };
}

// Configuration de Scrollama
function setupScrollama() {
  // Initialiser scrollama
  const scroller = scrollama();
  
  // Configurer scrollama
  scroller
    .setup({
      step: '.step',
      offset: 0.5,
      debug: false
    })
    .onStepEnter(response => {
      const { element, index, direction } = response;
      const year = d3.select(element).attr('data-year');
      
      // Mettre en évidence l'élément actif
      d3.selectAll('.step').classed('is-active', false);
      d3.select(element).classed('is-active', true);
      
      // Mettre à jour la visualisation
      window.updateVisualization(parseInt(year));
    });
  
  // Gérer le redimensionnement de la fenêtre
  window.addEventListener('resize', scroller.resize);
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', init);