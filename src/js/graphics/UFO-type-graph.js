export default function UFOTypeGraph() {
  var margin = { top: 20, right: 0, bottom: 50, left: 50 }; // Ajout de marges pour mieux espacer les éléments
  var width = window.innerWidth - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  // Vérification des valeurs de width et height
  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    console.error('Invalid width or height values');
    return;
  }

  // Ajouter l'élément svg au body de la page
  var svg = d3.select("#ufo-type-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Données de formes d'OVNIs
  var data = [
    { "year": 2000, "soucoupe": 12, "cigare": 8, "triangle": 15, "sphere": 10 },
    { "year": 2001, "soucoupe": 18, "cigare": 5, "triangle": 20, "sphere": 12 },
    { "year": 2002, "soucoupe": 20, "cigare": 7, "triangle": 25, "sphere": 15 },
    { "year": 2003, "soucoupe": 22, "cigare": 10, "triangle": 30, "sphere": 18 },
    { "year": 2004, "soucoupe": 30, "cigare": 12, "triangle": 35, "sphere": 20 }
  ];

  const allowedShapes = ["soucoupe", "cigare", "triangle", "sphere"];
  const allowedYears = [2000, 2001, 2002, 2003, 2004];

  // Filtrer les données
  const filteredData = data.filter(entry =>
    allowedYears.includes(entry.year)
  );

  if (filteredData.length === 0) {
    console.error('No data available after filtering.');
    return;
  }

  // Liste des groupes (les types d'OVNI)
  var keys = Object.keys(filteredData[0]).slice(1); // Exclure l'année

  // Ajouter l'axe X
  var x = d3.scaleLinear()
    .domain(d3.extent(filteredData, function (d) { return d.year; }))
    .range([0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height * 0.8 + ")")
    .call(d3.axisBottom(x).tickSize(-height * 0.7).tickValues([2000, 2001, 2002, 2003, 2004]))
    .select(".domain").remove();

  // Personnalisation des ticks de l'axe X
  svg.selectAll(".tick line")
    .attr("stroke", "#b8b8b8")
    .attr("stroke-width", 1);

  svg.selectAll(".tick text")
    .style("font-size", "14px")
    .style("fill", "#555");

  // Ajouter le label de l'axe X
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .style("font-size", "16px")
    .style("fill", "#333")
    .text("Time (year)");

  // Ajouter l'axe Y
  var y = d3.scaleLinear()
    .domain([0, d3.max(filteredData, function (d) {
      return d.soucoupe + d.cigare + d.triangle + d.sphere;
    })])
    .range([height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y).ticks(5).tickSize(-width))
    .select(".domain").remove();

  // Personnalisation des ticks de l'axe Y
  svg.selectAll(".tick line")
    .attr("stroke", "#b8b8b8")
    .attr("stroke-width", 1);

  svg.selectAll(".tick text")
    .style("font-size", "14px")
    .style("fill", "#555");

  // Palette de couleurs
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeDark2);

  // Empiler les données
  var stackedData = d3.stack()
    .keys(keys)
    (filteredData);

  // Créer un tooltip
  var Tooltip = svg
    .append("text")
    .attr("x", 10)
    .attr("y", 30)
    .style("opacity", 0)
    .style("font-size", "17px")
    .style("background", "white");

  // Fonctions pour gérer le tooltip
  var mouseover = function (d) {
    Tooltip.style("opacity", 1);
    d3.selectAll(".myArea").style("opacity", 0.2);
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
  };

  var mousemove = function (event, d) {
    var grp = d.key;
    var year = Math.round(x.invert(d3.pointer(event)[0])); // Trouver l'année correspondante
    var value = filteredData.find(item => item.year === year)?.[grp] || 0; // Trouver la valeur correspondante
    Tooltip.text(grp + ": " + value + " sightings in " + year);
  };

  var mouseleave = function (d) {
    Tooltip.style("opacity", 0);
    d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none");
  };

  // Générateur d'aire
  var area = d3.area()
    .x(function (d) { return x(d.data.year); })
    .y0(function (d) { return y(d[0]); })
    .y1(function (d) { return y(d[1]); });

  // Afficher les zones empilées
  svg
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", "myArea")
    .style("fill", function (d) { return color(d.key); })
    .attr("d", area)
    .on("mouseover", function (event, d) {
      mouseover.call(this, d);
      // Ajouter une légende au survol avec une transition douce
      svg.append("text")
        .attr("class", "legend")
        .attr("x", width - 150)
        .attr("y", 50)
        .style("font-size", "14px")
        .style("fill", color(d.key))
        .style("opacity", 0)
        .transition()
        .duration(300)
        .style("opacity", 1)
        .text(d.key);
    })
    .on("mousemove", mousemove)
    .on("mouseleave", function (d) {
      mouseleave.call(this, d);
      // Supprimer la légende au départ du survol avec une transition douce
      svg.selectAll(".legend")
        .transition()
        .duration(300)
        .style("opacity", 0)
        .remove();
    });
}