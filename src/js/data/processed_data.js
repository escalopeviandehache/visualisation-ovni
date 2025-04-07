import csv from '../../../public/data/complete.csv';
console.log(csv)

const getYearAndShape = () => {
    return new Promise((resolve, reject) => {
        try {
            const result = csv.map(row => ({
                year: row.datetime.split('/')[2].split(' ')[0], // Extract only the year
                shape: row.shape
            }));
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
};

getYearAndShape()
    .then(data => console.log(data))
    .catch(error => console.error(error));

console.log(getYearAndShape());