const express = require('express');
const router = express.Router();

const Skill = require('../model/skillsModel');
const Tech = require('../model/techModel');

router.post('/fetchSkills', async (req, res) => {
  try {
    const input = req.params

    const allSkills = await Skill.find();

    // Sort the skills to find the top 3 and bottom 3
    const topSkills = allSkills.slice().sort((a, b) => b.score - a.score).slice(0, 3);
    const bottomSkills = allSkills.slice().sort((a, b) => a.score - b.score).slice(0, 2);

    const techSkills = await Tech.find();
    console.log('Tech Skills:', techSkills);

    const techSkillsSet = new Set(techSkills.map(t => t.skill));
    console.log('Tech Skills Set:', techSkillsSet);

    const filteredTopSkills = topSkills.filter((skill) => !techSkillsSet.has(skill.name));

    // Remove matching skills from bottomSkills
    const filteredBottomSkills = bottomSkills.filter((skill) => !techSkillsSet.has(skill.name));

    // Create a new object with the remaining skills from topSkills and bottomSkills
    const newSkills = [
      ...filteredTopSkills.map(skill => ({
        name: skill.name,
        desc: skill.desc  // Assuming filteredTopSkills already has 'desc' attribute
      })),
      ...techSkills.map(skill => ({
        name: skill.skill,
        desc: skill.desc  // Assuming techSkills already has 'desc' attribute
      }))
    ];

    // Create sets for easy lookup
    const inputSkillsSet = new Set(input.map(skill => skill.skill));
    const newSkillNamesSet = new Set(newSkills.map(skill => skill.name));
    const bottomSkillNamesSet = new Set(filteredBottomSkills.map(skill => skill.name));

    // Compare newSkills with input to create toAdd
    const toAdd = newSkills.filter(skill => !inputSkillsSet.has(skill.name));

    // Compare input with bottomSkills to create toRemove
    const toRemove = input.filter(skill => bottomSkillNamesSet.has(skill.skill));

    // Send response
    res.status(200).json({
      status: 200,
      message: 'Top and bottom skills fetched and filtered successfully',
      data: {
        newSkills,
        toAdd,
        toRemove
      },
      success: true,
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error.message,
      success: false,
    });
  }
});

router.put('/skills/update', async (req, res) => {
  const updates = req.body;

  try {
    // Iterate through each update
    for (const update of updates) {
      const { name, score } = update;

      // Find the skill by name
      const skill = await Skill.findOne({ name });

      if (!skill) {
        return res.status(404).json({ error: `Skill '${name}' not found` });
      }

      // Update the score
      skill.score += parseInt(score); // Assuming score is a number

      // Save the updated skill
      await skill.save();
    }

    return res.json({ message: 'Skills updated successfully' });
  } catch (error) {
    console.error('Error updating skills:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
