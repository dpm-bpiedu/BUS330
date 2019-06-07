require('dotenv').config();
const moment = require('moment');
const request = require('request');
const fs = require('fs');
const appKey = process.env.DR_KEY;
const content = '<html><body>test</body></html>';

const testName = `test.${moment().format('DD.MM.hh.mm.ss')}`;

config = {
  url: 'https://docraptor.com/docs',
  encoding: null,
  headers: {
    'Content-Type': 'application/json'
  },
  json: {
    user_credentials: appKey,
    doc: {
      document_content: content,
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

request.post(config, function(err, response, body) {
  if(err) {
    console.log(err.message);
  }
  fs.writeFile(`OUTPUT/${testName}`, body, 'binary', function(writeErr) {
    console.log(`Saved: ${testName}`);
  });
});


