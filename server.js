const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors=require('cors')
const cloudinary = require("cloudinary").v2;
// const dotenv = require('dotenv');

// dotenv.config();


const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const matching = require('./controller/companyMatch')
const agricultureController = require('./controller/agricultureController.js');
const resumeController = require('./controller/resumeController.js');

const techModel=require('./model/techModel')
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY

})

const port = process.env.PORT;
app.use('/',matching);
app.use('/api/resume', resumeController);
app.use('/api/agriculture',agricultureController)

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

    // Selecting all <h3> and <li> tags
    const headings = articleContent.find('h3');
    const listItems = articleContent.find('li');

    // Initialize an index for listItems
    let listItemIndex = 0;

    headings.each((index, element) => {
      const headingText = $(element).text().trim();
      const skillNumber = parseInt(headingText.split('.')[0].trim()); // Extract the number from "X. Skill Name"
      const skillName = headingText.slice(headingText.indexOf('.') + 2); // Extract the skill name

      // Check if it's not the 8th skill (UI/UX Design)
      if (skillNumber !== 8) {
        const skillObject = {
          skill: skillName,
          skilltolearn: []
        };

        // Find corresponding <li> tag with "Skills to Learn:" after the current heading
        while (listItemIndex < listItems.length) {
          const listItem = $(listItems.get(listItemIndex));
          const listItemText = listItem.text().trim();

          if (listItemText.includes('Skills to Learn:')) {
            const desc = listItemText;
            const skillsToLearnText = listItemText.slice(listItemText.indexOf('Skills to Learn:') + 'Skills to Learn:'.length).trim();
            const skillsToLearn = skillsToLearnText.split(',').map(skill => skill.trim());
            skillObject.skilltolearn = skillsToLearn;
            skillObject.desc = desc;
            skills.push(skillObject);
            listItemIndex++;
            break;
          }

          listItemIndex++;
        }
      }
    });

    // Output the skills array in JSON format
    console.log(JSON.stringify(skills));

    // techModel.insertMany(skills)
    //   .then(() => {
    //     console.log('Skills inserted into MongoDB successfully');
    //   })
    //   .catch(error => {
    //     console.error('Error inserting skills into MongoDB:', error);
    //   });


  })
  .catch(error => {
    console.error('Error fetching the page: ', error);
  });


scrape();

app.listen(port, () => {
console.log(`server running at ${port}`);
});