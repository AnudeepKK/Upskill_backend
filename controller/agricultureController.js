const Agriculture = require('./../model/agricultureModel.js')
const express = require("express");
const router = express.Router();

router.get('/skills', async (req, res) => {
    try{
        const data = await Agriculture.find();

        res.status(200).json({
            status: 'success',
            data:{
                data
            }
        })
    }catch (err){
        console.error(err);
        res.status(404).json({
            status: 'fail'
        })
    }
})

router.post('/scrape', async (req, res) => {
    try{
    const scraped = await scrape();
    const headings = scraped.arr;
    const desc = scraped.desc;

    let documents = []
    for(let i=0; i<headings.length; i++){
        documents.push({
            skills: headings[i],
            desc: desc[i]
        })
    }

    console.log(documents);

    const result = await Agriculture.insertMany(documents);

    console.log(result);
    res.status(201).json({
        status:'success',
        data: result
    })


    }catch(err){
        console.error(err);
    }
})

function scrape() {
    return new Promise((resolve, reject) => {
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


module.exports = router;