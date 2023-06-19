import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { environment } from 'src/environment';

const app = initializeApp(environment.firebaseConfig);
export const db = getDatabase(app);

// Get the messaging service
// export const msg = getMessaging(app);
