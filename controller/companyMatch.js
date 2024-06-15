const express = require('express')
const router = express.Router()

const Skill = require('../model/skillsModel')
const techModel =require('../model/techModel')

router.get('/fetchSkills',async(req, res)=>{
  try{

    const aggregationPipeline = [
      { $sort: { score: -1 } }, // Sort by score in descending order
      { $facet: {
          topSkills: [ { $limit: 3 } ],
          bottomSkills: [ { $limit: 3 }, { $sort: { score: 1 } } ]
        }
      }
    ];

    // Execute the aggregation pipeline using the Skill model
    const result = await Skill.aggregate(aggregationPipeline);

    // Extract top and bottom skills from the result
    const { topSkills, bottomSkills } = result[0];

    // Send response
    res.status(200).json({
      status: 200,
      message: 'Top and bottom skills fetched successfully',
      data: { topSkills, bottomSkills },
      success: true,
    });

  }catch(error){
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error.message,
      success: false,
    });
  }


})

module.exports = router