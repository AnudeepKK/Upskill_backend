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

//Tech

function extractSkills($) {
  const headings = $('h3'); // Select all <h3> elements in the document

  const result = []; // Initialize an array to store the extracted skills

  headings.each((index, heading) => {
    const skill = $(heading).text().trim(); // Extract the text content of the <h3> element as the skill name

    // Find the next sibling paragraph that contains skills to learn
    const nextParagraph1 = $(heading).next().next(); // Select the next sibling element (second next) after <h3>
    const nextParagraph2 = $(nextParagraph1).next().next(); 
    const nextParagraph = $(nextParagraph2).next().next(); 
    const skillItems = nextParagraph.find('ul'); // Find all <li> elements within the next paragraph

    const skillsToLearn = []; // Initialize an array to store the skills to learn

    skillItems.each((i, item) => {
      const skillText = $(item).text().replace('Skills to Learn:', '').trim(); // Extract text content of <li> element
      skillsToLearn.push(skillText); // Push the extracted skill to learn into the array
    });

    // Push the skill and its corresponding skills to learn into the result array
    result.push({ skill, skillsToLearn });
  });

  return result; // Return the array of extracted skills and skills to learn
}


// URL to scrape
const techUrl = 'https://www.linkedin.com/pulse/top-10-high-income-skills-learn-2024-make-six-figure-salary-moroz-pwspf/';

async function scrapeTechSkills() {
try {
// Fetch the HTML content from the URL
const { data } = await axios.get(techUrl);

    // Load the fetched HTML content using cheerio
    const $ = cheerio.load(data);

    // Call the extractSkills function and log the result
    const skills =   extractSkills($);

    console.log(skills);

    // Insert the data into MongoDB
    // await insertSkillsIntoMongoDB(skills);

} catch (error) {
    console.log("Error scraping tech skills:", error);
}
}

scrapeTechSkills();

app.listen(port, () => {
console.log(`server running at ${port}`);
});