const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");
const args = process.argv.slice(2)

chapters = ['frontmatter', '01', '02', '03', '04','05','06','06','07','08','09'];

const chapter = args[0];

const urlStem =
  "https://ne.edgecastcdn.net/0004BA/constellation/testing/pdf/BUS330/all/chapter_";

request(`${urlStem}${chapter}.html`, function(error, response, html) {
  const $ = cheerio.load(html);
  const body = $('body').html();
  const bodyContent = $(body).html();
  const section = `<section class='chapter01'>${body}</section>`;  

  fs.appendFile('OUTPUT/test.html', section, (err) => {
    if(err) {
      console.log(err);
    }
    console.log(`file ${chapter} appended`);
  });

}

//  request(`${urlStem}${chapter}.html`, function(err, response, html) {

//   const $ = cheerio.load(html);
//   const body = $('body').html();
//   const bodyContent = $(body).html();
//   const section = `<section class='chapter01'>${body}</section>`;

//   fs.appendFile('OUTPUT/test2.html', section, (err) => {
//     if(err) console.log(err);
//     console.log("new file");
//   });
// }

