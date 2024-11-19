import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: /* Your API Key */,
  authDomain: /* Your Auth Domain */,
  projectId: /* Your Project ID */,
  storageBucket: /* Your Storage Bucket */,
  messagingSenderId: /* Your Messaging Sender ID */,
  appId: /* Your App ID */,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);