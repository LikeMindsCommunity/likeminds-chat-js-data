importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging.js');
 
// beta
// const config = {
//     apiKey: environment.firebaseConfig.apiKey,
//     apiKey: 'AIzaSyBWjDQEiYKdQbQNvoiVvvOn_cbufQzvWuo',
//     authDomain: 'collabmates-beta.firebaseapp.com',
//     databaseURL: 'https://collabmates-beta.firebaseio.com',
//     projectId: 'collabmates-beta',
//     storageBucket: 'collabmates-beta.appspot.com',
//     messagingSenderId: '983690302378',
//     appId: '1:983690302378:web:b2fa2c58f2351d5c1b91d3',
//     measurementId: 'G-R2PXYC9F4S',
// };

// Prod
const config = {
    apiKey: "AIzaSyCmu_u-n31x2WMQlWAciP5RDXGn2qMuXrg",
    authDomain: "collabmates-3d601.firebaseapp.com",
    databaseURL: "https://collabmates-3d601.firebaseio.com",
    projectId: "collabmates-3d601",
    storageBucket: "collabmates-3d601.appspot.com",
    messagingSenderId: "645716458793",
    appId: "1:645716458793:web:779debf3286d6049"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

// messaging.usePublicVapidKey('BH7RhEM3kdPrZy-TDwOp6dPg7wH2nLa17V_c4DO_jfg-ih1L25fi8gNWxXNWWMK4eAC2-RqE8U5jAoCtjwRlmyo');
messaging.usePublicVapidKey('BAyZ_fBA6AKWULBrvP0p-TPLaMU97GA2pMFAFxoU4mKe_XK6vyn9ZBSCR-o6KWWbvkcl55oJoeYR90we9y5b17s');

//'assets/images/png/logo.png'
messaging.onBackgroundMessage((payload) => { 
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.sub_title,
        icon: payload.data.community_logo,
        // icon: payload.data.community_logo, 
        data: { 
            // url: 'https://betaweb.likeminds.community/'
            url: 'https://web.likeminds.community/'
        },
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click event listener

self.addEventListener('notificationclick', e => {
    // Close the notification popout
    e.notification.close();
    // Get all the Window clients
    e.waitUntil(clients.matchAll({ 
        type: 'window' 
    }).then(
        clientsArr => {
      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some(windowClient => windowClient.url === e.notification.data.url ? (windowClient.focus(), true) : false);
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus) clients.openWindow(e.notification.data.url).then(windowClient => windowClient ? windowClient.focus() : null);
    }
    ));
  });



// if (messaging) {
//     messaging.onBackgroundMessage(payload => {
//       const notificationTitle = payload.notification.title || payload.data.title;
//       const notificationOptions = {
//         body: payload.notification.body || payload.data.sub_title || '',
//         icon: 'https://firebasestorage.googleapis.com/v0/b/yes-4-web.appspot.com/o/pontonos%2Ficons%2Fandroid-chrome-192x192.png?alt=media&token=35616a6b-5e70-43a0-9284-d780793fa076',
//         data: payload.data
//       };
  
//       return self.registration.showNotification(notificationTitle, notificationOptions);
//     });
  
//     self.addEventListener('notificationclick', event => {
//       event.notification.close();
//       event.waitUntil(clients.matchAll({ type: "window" }).then(function(clientList) {
//         for (let i = 0; i < clientList.length; i++) {
//           const client = clientList[i];
//           if (client.url === '/' && 'focus' in client) {
//             if (event.notification.data.route) client.href(event.notification.data.route);
//             return client.focus();
//           }
//         }
//         if (clients.openWindow)
//           return clients.openWindow(event.notification.data.route || '/');
//       }));
//     });
//   }