const express = require('express');
const Resume = require('../model/resumeModel.js');

const router = express.Router();

router.post('/', async (req, res) => {
    try{
        const url = req.body.url;
        const name = req.body.name;
        const profession = req.body.profession;

        const resumeData = await Resume.create({
            url: url,
            name: name,
            pofession: profession
        })

        res.status(201).json({
            status: 'success',
            data: resumeData
        })
    }catch(err){
        console.log(err);
    }
    
})

router.get('/:tag',async(req, res) => {
    try{
        const {tag} = req.params;

        const data = await Resume.find({tag: tag});

        res.status(200).json({
            status: 'success',
            data: data
        })
    }catch(err){
        console.error(err);
    }
})

module.exports = router;