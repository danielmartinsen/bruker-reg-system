const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  env: {
    LICENSE_KEY: process.env.LICENSE_KEY,

    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: 'bruker-reg-system.firebaseapp.com',
    FIREBASE_DATABASE_URL: 'https://bruker-reg-system.firebaseio.com',
    FIREBASE_PROJECT_ID: 'bruker-reg-system',
    FIREBASE__STORAGE_BUCKET: 'bruker-reg-system.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
}
