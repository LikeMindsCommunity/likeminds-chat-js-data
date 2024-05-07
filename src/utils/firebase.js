import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { environment } from '../environments';

const app = initializeApp(environment.firebaseConfig);
export const db = getDatabase(app);
