// Import the functions you need from the SDKs you need
import admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'

const serviceAccountContent = fs.readFileSync(
  path.join(
    __dirname,
    'proyectofinaltecweb-firebase-adminsdk-yg42t-f6fd7c9332.json'
  ),
  'utf8'
)
const serviceAccount = JSON.parse(serviceAccountContent)
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: 'https://proyectofinaltecweb-default-rtdb.firebaseio.com',
  databaseAuthVariableOverride: {
    // As an admin, the app has access to read and write all data, regardless of Security Rules
    // id de una cuenta de admin (/roles)
    uid: 'UNsdBWKoimeH9EWMXs8CcaY52lq1',
  },
})

export const database = admin.database()
