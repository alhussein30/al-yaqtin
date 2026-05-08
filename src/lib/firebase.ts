import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const dbId = (firebaseConfig as any).firestoreDatabaseId;
export const db = dbId && dbId !== '(default)' ? getFirestore(app, dbId) : getFirestore(app);
export const auth = getAuth();
export { signInAnonymously };

// Error handling logic as per guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection strictly as per guidelines, but with resilience
async function testConnection(retries = 3) {
  const path = 'test/connection';
  for (let i = 0; i < retries; i++) {
    try {
      await getDocFromServer(doc(db, path));
      console.log("Firebase connection successful");
      return; // Success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isOffline = errorMessage.toLowerCase().includes('offline') || 
                        errorMessage.toLowerCase().includes('failed to fetch') ||
                        errorMessage.toLowerCase().includes('network error') ||
                        errorMessage.toLowerCase().includes('quota exceeded');
      
      if (isOffline && i < retries - 1) {
        console.warn(`Firebase connection attempt ${i + 1} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      if (isOffline) {
        if (errorMessage.toLowerCase().includes('quota')) {
          console.error("Firestore quota exceeded. Please check your usage at https://console.firebase.google.com/project/_/firestore/usage");
        } else {
          console.info("Note: Firebase connection test failed (likely offline or still provisioning). This is normal during initial setup.");
        }
      } else {
        // Only log serious configuration errors
        if (errorMessage.includes('permission-denied') || errorMessage.includes('not-found')) {
           console.log("Firebase initialized (waiting for initial data/setup)");
        } else {
           console.warn("Firebase connection test notice:", errorMessage);
        }
      }
    }
  }
}

// Start connection test
testConnection();
