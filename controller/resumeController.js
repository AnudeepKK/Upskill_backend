const express = require('express');
const Resume = require('../model/resumeModel.js');

const router = express.Router();
const upload = require('./../multerConfig.js')

router.post('/',upload.single('url'), async (req, res) => {
    try{
        // const url = req.body.url;
        const name = req.body.name;
        const tag = req.body.tag;

        //get the image object
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(401).json({
              success: false,
              message: "No image provided",
            });
          }

          //upload the image from the uploads floder to the cloudinary in to the folder feedback_images
    const imageResponse = await cloudinary.uploader.upload(imageFile.path, {
        folder: "resume_images",
      });

      fs.unlinkSync(imageFile.path);

      const imageUrl = imageResponse.secure_url;

        const resumeData = await Resume.create({
            url: imageUrl,
            name: name,
            tag: tag
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