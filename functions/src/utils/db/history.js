import { db } from "../../lib/firebase.js";

const collection = db.collection("history");

export const get = async (waId) => {
    const docRef = collection.doc(waId);

    const doc = await docRef.get();
    if (doc.exists) {
        return doc.data().history || [];
    } else {
        await docRef.set({ history: [] });
        return [];
    }
}
