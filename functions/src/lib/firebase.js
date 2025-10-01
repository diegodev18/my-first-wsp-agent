import admin from "firebase-admin";

// Inicializar Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}

// Obtener referencia a Firestore
const db = admin.firestore();

export { db, admin };
