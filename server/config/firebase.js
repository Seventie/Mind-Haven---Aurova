const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        const filePath = path.isAbsolute(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
            ? process.env.FIREBASE_SERVICE_ACCOUNT_PATH
            : path.join(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            serviceAccount = JSON.parse(fileContent);
        }
    }

    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized successfully');
    } else {
        console.warn('Firebase Admin not initialized: No service account provided');
    }
} catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
}

module.exports = admin;
