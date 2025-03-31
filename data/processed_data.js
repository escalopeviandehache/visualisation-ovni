import allUfoData from 'omplete.csv';
import { getRandomInt } from '../lib/math.js';
import * as d3 from 'd3';
import { storage } from '/src/js/lib/storage.js';

// Retransforme les chaines en date et formatte la date.
const parseTime = d3.timeParse('%m/%d/%Y %H:%M');
const dateFormat = d3.timeFormat('%Y');
export const parseYear = d3.timeParse('%Y');


/*-----------------------------------------
 Nettoyage et mise en place des données
-----------------------------------------*/

// nettoie une première fois les données
const cleanedData = allUfoData.filter(d =>
    d.shape != null &&
    d.comments != null &&
    d.latitude != null &&
    d.longitude != null &&
    d.country === 'us' &&
    parseTime(d.datetime) >= parseTime('01/01/1940 00:00')
)

// permet de voir quelles formes sont les plus populaires
// const orderByOccurrence = (data, property) => {
//     let counts = {};

//     data.forEach(object => {
//         if(!counts[object[property]]) counts[object[property]] = 0;
//         counts[object[property]]++;
//     });

//     return Object.entries(counts).sort((a,b) => b[1]-a[1]);
// }

// orderByOccurrence(cleanedData, 'shape');

//  Sélectionne les données pour le top 5 des formes.
export const ufoData = cleanedData.filter(d =>
    d.shape === 'light' ||
    d.shape === 'circle' ||
    d.shape === 'triangle' ||
    d.shape === 'unknown' ||
    d.shape === 'fireball'
)

export function filterShapeData() {
    const shape = storage.getItem('shape');

    // Ne prend que les entrées avec la forme définie au préalable (sera déterminée par un clic de l'utilisateur)
    return ufoData.filter(d => d.shape == shape);

}

/*--------------------------------------------------------
 Filtrer les données pour les marqueurs sur la carte
--------------------------------------------------------*/
export function getRandSightings() {
    const shapeData = filterShapeData();

    const randSightings = [];

    for (let i = 1; i <= 5; i++) {

        const randIndex = getRandomInt(0, shapeData.length);

        const lat = shapeData[randIndex].latitude;
        const lng = shapeData[randIndex].longitude;

        // Permet de ne pas avoir des marqueurs trop proches les uns des autres
        while (isTooClose(lat, lng, randSightings)) {
            randIndex = getRandomInt(0, shapeData.length);
            lat = shapeData[randIndex].latitude;
            lng = shapeData[randIndex].longitude;
        }

        randSightings.push(shapeData[randIndex]);
    }

    return randSightings;
}

function isTooClose(lat, lng, array) {
    if (!array.length) return;

    let isTooClose = false;
    let i = 0;

    while (i < array.length && !isTooClose) {
        if (Math.abs(array[i].latitude - lat) < 2 || Math.abs(array[i].longitude - lng) < 2) isTooClose = true;
        i++
    }

    return isTooClose;
}


/*--------------------------------------------------------
 Filtrage des données pour le graphe d'entrées par année
--------------------------------------------------------*/

// Fait un tableau de dates pour pouvoir ensuite les compter.
export function getStringYearData() {
    const shapeData = filterShapeData();

    return shapeData.map(d => dateFormat(parseTime(d.datetime)));
}

// Fait un tableau de dates pour pouvoir ensuite les compter.
export function getDateYearData() {
    return getStringYearData().map(d => parseYear(d));
}

// Crée un objet avec les années comme propriétés et le nombre d'entrées comme valeurs.
function countEntries() {
    const stringYearData = getStringYearData();

    const count = {};

    for (const year of stringYearData) {
        count[year] = count[year] ? count[year] + 1 : 1;
    }

    return count;
}

// Crée un tableau avec pour clé l'année et pour valeur le nombre d'entrées.
export function getEntriesPerYear() {
    const entriesPerYear = [];
    const count = countEntries();

    for (const [year, amount] of Object.entries(count)) {
        entriesPerYear.push({
            'year': parseYear(year),
            'amount': amount
        })
    }

    return entriesPerYear;
}

// défini le nombre d'entrées max.
export function getMaxAmountRounded() {
    let maxRounded = Math.ceil(d3.max(Object.values(countEntries())) / 100) * 100;
    if (maxRounded / 100 % 2 != 0 && maxRounded < 1000) maxRounded += 100;

    return maxRounded;
}