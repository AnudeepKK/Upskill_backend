const express = require('express')
const router = express.Router()

const Skill = require('../model/skillsModel')
const Tech =require('../model/techModel')

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

   // Fetch all skills from the Tech model
   const techSkills = await Tech.find();
  //  console.log(techSkills)
   const techSkillsSet = new Set(techSkills.map(t => t.skill));

   console.log(techSkillsSet)

   // Remove matching skills from topSkills
   topSkills = topSkills.filter(skill => !techSkillsSet.has(skill.name));

   // Remove matching skills from bottomSkills
   bottomSkills = bottomSkills.filter(skill => !techSkillsSet.has(skill.name));

   // Create a new object with the remaining skills from topSkills and original skills from topSkills
   const newSkills = [...topSkills, ...bottomSkills];

   // Send response
   res.status(200).json({
     status: 200,
     message: 'Top and bottom skills fetched and filtered successfully',
     data: { newSkills, topSkills, bottomSkills },
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