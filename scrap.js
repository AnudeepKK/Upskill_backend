const axios = require('axios');
const cheerio = require('cheerio');

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
            const skillsToLearnText = listItemText.slice(listItemText.indexOf('Skills to Learn:') + 'Skills to Learn:'.length).trim();
            const skillsToLearn = skillsToLearnText.split(',').map(skill => skill.trim());
            skillObject.skilltolearn = skillsToLearn;
            skills.push(skillObject);
            listItemIndex++;
            break;
          }

          listItemIndex++;
        }
      }
    });

    // Output the skills array in JSON format
    console.log(JSON.stringify(skills, null, 2));

  })
  .catch(error => {
    console.error('Error fetching the page: ', error);
  });
