import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getMessaging } from 'firebase/messaging';

// Beta
const firebaseConfig = {
    apiKey: 'AIzaSyBWjDQEiYKdQbQNvoiVvvOn_cbufQzvWuo',
    authDomain: 'collabmates-beta.firebaseapp.com',
    databaseURL: 'https://collabmates-beta.firebaseio.com',
    projectId: 'collabmates-beta',
    storageBucket: 'collabmates-beta.appspot.com',
    messagingSenderId: '983690302378',
    appId: '1:983690302378:web:b2fa2c58f2351d5c1b91d3',
    measurementId: 'G-R2PXYC9F4S',
};

// Prod
// const firebaseConfig = {
//     apiKey: 'AIzaSyCmu_u-n31x2WMQlWAciP5RDXGn2qMuXrg',
//     authDomain: 'collabmates-3d601.firebaseapp.com',
//     databaseURL: 'https://collabmates-3d601.firebaseio.com',
//     projectId: 'collabmates-3d601',
//     storageBucket: 'collabmates-3d601.appspot.com',
//     messagingSenderId: '645716458793',
//     appId: '1:645716458793:web:779debf3286d6049',
// };

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Get the messaging service
export const msg = getMessaging(app);
