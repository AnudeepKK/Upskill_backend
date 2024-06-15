const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors=require('cors')

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { Console } = require('console');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;

mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
console.log("db connected");
})
.catch((err) => {
console.log(err);
});

const url = 'https://www.linkedin.com/pulse/top-10-high-income-skills-learn-2024-make-six-figure-salary-moroz-pwspf';

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const skills = [];

    // Selecting specific tags within the article content div
    const articleContent = $('div[data-test-id="article-content-blocks"]');
    articleContent.find('h3').each((index, element) => {
        const headingText = $(element).text().trim();
        console.log(`Heading ${index + 1}: ${headingText}`);
      });
    // Selecting <h3> tags and their contents
    articleContent.find('h3').each((index, element) => {
      const headingText = $(element).text().trim();
      const skillNumber = parseInt(headingText.split('.')[0].trim()); // Extract the number from "X. Skill Name"
      const skillName = headingText.slice(headingText.indexOf('.') + 2); // Extract the skill name

      // Check if it's not the 8th skill (UI/UX Design)
      if (skillNumber !== 8) {
        const skillObject = {
          skill: skillName,
          skilltolearn: []
        };

        // Find corresponding <li> tag for the current <h3>
        const listItem = articleContent.find('li').eq(index);
        const listItemText = listItem.text().trim();

        // Check if <li> contains "Skills to Learn:"
        if (listItemText.includes('Skills to Learn:')) {
          // Extract "Skills to Learn:" list from <li> content
          const skillsToLearnText = listItemText.slice(listItemText.indexOf('Skills to Learn:') + 'Skills to Learn:'.length).trim();
          const skillsToLearn = skillsToLearnText.split(',').map(skill => skill.trim());

          skillObject.skilltolearn = skillsToLearn;
          skills.push(skillObject);
        }
      }
    });

    // Output the skills array in JSON format
    console.log(JSON.stringify(skills, null, 2));

  })
  .catch(error => {
    console.error('Error fetching the page: ', error);
  });



app.listen(port, () => {
console.log(`server running at ${port}`);
});