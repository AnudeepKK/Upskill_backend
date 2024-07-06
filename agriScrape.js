const cheerio = require("cheerio");
const Agriculture = require('./model/agricultureModel');
const request = require("request")

function scrape() {
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

                storeInDB({arr, desc})
                
                resolve({arr, desc});
        }});
    };

async function storeInDB(scrap){
        const scraped = scrap;
        const headings = scraped.arr;
        const desc = scraped.desc;
    
        let documents = []
        for(let i=0; i<headings.length; i++){
            documents.push({
                skills: headings[i],
                desc: desc[i]
            })
        }

        console.log(documents.length)
    
        console.log(documents);
    
        const result = await Agriculture.insertMany(documents);
    
        console.log(result);
        
        
}

module.exports = scrape;