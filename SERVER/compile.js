
const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');



request('https://ne.edgecastcdn.net/0004BA/constellation/testing/pdf/BUS330/all/chapter_01.html', function(err, response, html) {

  const $ = cheerio.load(html);
  const body = $('body').html();
  const bodyContent = $(body).html();
  const section = `<section class='chapter01'>${body}</section>`

  fs.writeFile('OUTPUT/test2.html', section, (err) => {
    if(err) console.log(err);
    console.log("new file");
  })

});



