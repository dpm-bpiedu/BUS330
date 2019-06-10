require('dotenv').config();
const moment = require('moment');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const appKey = process.env.DR_KEY;
const contentURL = 'https://www.cnstln-test.net';

const testName = `test.${moment().format('MMMMDD.')}${moment().format('hh.mm')}`;

config = {
  url: 'https://docraptor.com/docs',
  encoding: null,
  headers: {
    'Content-Type': 'application/json'
  },
  json: {
    user_credentials: appKey,
    doc: {
      document_url: contentURL,
      type: 'pdf',
      name: testName,
      test: false,
      prince_options: {
        media: 'print',
        profile: 'PDF/X-1a:2001'
      }
    }
  }
};

// request.post(config, function(err, response, body) {
//   if(err) {
//     console.log(err.message);
//   }
//   fs.writeFile(`OUTPUT/${testName}.pdf`, body, 'binary', function(writeErr) {
//     console.log(`Saved: ${testName}`);
//   });
// });

request('https://ne.edgecastcdn.net/0004BA/constellation/testing/pdf/BUS330/all/chapter_01.html', function(err, response, html) {

  const $ = cheerio.load(html);
  const body = $('body').html();
  const bodyContent = $(body).html();

  fs.writeFile('OUTPUT/test1.html', body, (err) => {
    if(err) console.log(err);
    console.log("new file");
  })

});



