const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config();

const client_id = process.env.YT_CLIENT_ID;
const client_secret = process.env.YT_CLIENT_SECRET;
const redirect_uri = 'urn:ietf:wg:oauth:2.0:oob';

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uri
);

const scopes = [
  'https://www.googleapis.com/auth/youtube.upload'
];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Open link:');
console.log(url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Paste code here: ', function(code) {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('Error with getting token', err);
      rl.close();
      return;
    }
    console.log('Your refresh_token:', token.refresh_token);
    rl.close();
  });
});