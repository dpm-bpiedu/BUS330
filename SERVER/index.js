require('dotenv').config();
const request = require('request');
const fs = require('fs');
const appKey = process.env.DR_KEY;
const content = '<html><body>test</body></html>';

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
      name: 'test1234',
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
  fs.writeFile('test12344.pdf', body, 'binary', function(writeErr) {
    console.log(response.status);
  });
});

