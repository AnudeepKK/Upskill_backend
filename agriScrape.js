const cheerio = require("cheerio");
const Agriculture = require('./model/agricultureModel');

function scrape() {
    return new Promise(async (resolve, reject) => {
        await Agriculture.deleteMany();
        request('https://agri.faisalzariservice.com/2023/05/skills-for-agriculture-students.html', (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                const docs = $('.entry-content-wrap');
                
                let arr = [];
                let desc = []
                docs.find('h2').each((i, elem) => {
                    arr.push($(elem).text());
                });

                docs.find('p').each((i, elem) => {
                    desc.push($(elem).text());
                });

                desc.shift();
                desc.pop();
                
                resolve({arr, desc});
            } else {
                reject(error || new Error('Failed to load the page'));
            }
        });
    });
}

// async function storeInDB

module.exports = scrape;