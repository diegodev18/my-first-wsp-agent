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

export const add = async (waId, { role, content }) => {
    const docRef = collection.doc(waId);

    const doc = await docRef.get();
    if (doc.exists) {
        const data = doc.data();
        try {
            const updatedHistory = data.history && Array.isArray(data.history) ?
                [...data.history, { role, content }] :
                [{ role, content }];
            await docRef.update({ history: updatedHistory });
        } catch (err) {
            console.error("Error updating history:", err);
        }
    } else {
        await docRef.set({ history: [{ role, content }] });
    }
}
