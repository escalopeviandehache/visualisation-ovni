import * as d3 from 'd3';
import csvData from '../../../public/data/complete.csv';

export default function UFOTypeGraph() {
  const margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#ufo-type-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const shapesToKeep = ["light", "cylinder", "triangle", "sphere", "cigar", "disk", "fireball", "unknown"];

  // nettoyage et transformation
  const filtered = csvData
    .filter(d => d.datetime && shapesToKeep.includes(d.shape))
    .map(d => ({
      year: new Date(d.datetime).getFullYear(),
      shape: d.shape
    }));

  const nested = d3.rollup(
    filtered,
    v => v.length,
    d => d.year,
    d => d.shape
  );

  const years = Array.from(nested.keys()).sort((a, b) => a - b);

  const stackData = years.map(year => {
    const yearData = { year: +year };
    shapesToKeep.forEach(shape => {
      yearData[shape] = nested.get(year)?.get(shape) || 0;
    });
    return yearData;
  });

  const x = d3.scaleLinear()
    .domain([1940, d3.max(stackData, d => d.year)]) // Commence à partir de 1940
    .range([0, width]);

  const y = d3.scaleLinear().range([height, 0]);

  const color = d3.scaleOrdinal()
    .domain(shapesToKeep)
    .range(d3.schemeTableau10);

  const stacked = d3.stack()
    .keys(shapesToKeep)
    .offset(d3.stackOffsetSilhouette)(stackData);

  y.domain([
    d3.min(stacked, layer => d3.min(layer, d => d[0])),
    d3.max(stacked, layer => d3.max(layer, d => d[1]))
  ]);

  const area = d3.area()
    .x(d => x(d.data.year))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

  const tooltip = svg.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .style("opacity", 0)
    .style("font-size", "16px")
    .style("fill", "#13c287")
    .style("font-weight", "bold");

  const greenShades = d3.scaleOrdinal()
    .domain(shapesToKeep)
    .range(["#00441b", "#006d2c", "#238845", "#41ab5d", "#74c476", "#a1d998", "#c7e9c0", "#e5f5e0"]);

  svg.selectAll("path")
    .data(stacked)
    .join("path")
    .attr("class", "myArea")
    .attr("fill", d => greenShades(d.key))
    .attr("d", area)
    .on("mouseover", function (event, d) {
      d3.selectAll(".myArea").style("opacity", 0.2);
      d3.select(this).style("opacity", 1);
      const shapeTranslations = {
        light: "lumière",
        cylinder: "cylindre",
        triangle: "triangle",
        sphere: "sphère",
        cigar: "cigare",
        disk: "disque",
        fireball: "boule de feu",
        unknown: "inconnu"
      };

      tooltip.style("opacity", 1).text(shapeTranslations[d.key]);
    })
    .on("mousemove", function (event, d) {
      const [xPos, yPos] = d3.pointer(event);
      const year = Math.round(x.invert(xPos));
      const value = stackData.find(item => item.year === year)?.[d.key] || 0;
      const shapeTranslations = {
        light: "lumière",
        cylinder: "cylindre",
        triangle: "triangle",
        sphere: "sphère",
        cigar: "cigare",
        disk: "disque",
        fireball: "boule de feu",
        unknown: "inconnu"
      };
      tooltip
        .attr("x", 10)
        .attr("y", 20)
        .text(`En ${year}`)
        .append("tspan")
        .attr("x", 10)
        .attr("dy", "1.2em")
        .text(`${value} ovnis de type ${shapeTranslations[d.key]}`);
    })
    .on("mouseleave", function () {
      d3.selectAll(".myArea").style("opacity", 1);
      tooltip.style("opacity", 0);
    });

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")))
    .select(".domain").remove();

  svg.append("text")
    .attr("x", width)
    .attr("y", height + 25)
    .style("text-anchor", "end")
    // .text("Time (year)");
}