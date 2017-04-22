var googleAuth = require('google-auth-library')
var google = require('googleapis')

var auth = new googleAuth()
var sheets = google.sheets('v4')


const sheet = process.env.GOOGLE_SPREADSHEET

function authorize(callback) {
  const config = JSON.parse(process.env.GOOGLE_CONFIG)

  var oauth2Client = new auth.OAuth2(config.client_id, config.client_secret)

  oauth2Client.setCredentials({
    refresh_token: config.refresh_token
  });

  return callback(oauth2Client)
}

function readSheet(range, callback) {
  authorize((auth) => {
    sheets.spreadsheets.values.get(
      {
        auth: auth,
        spreadsheetId: process.env.GOOGLE_SPREADSHEET,
        range: range,
      },
      callback
    );
  })
}

module.exports = readSheet