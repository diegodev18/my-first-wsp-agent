import { db } from "../../lib/firebase.js";

const collection = db.collection("history");

export const get = async (waId) => {
    const docRef = collection.doc(waId);

    const doc = await docRef.get();
    if (doc.exists) {
        /**
         * @type {Array<{role: string, parts: Array<{text: string}>}>}
         */
        const history = doc.data().history;
        if (!history || !Array.isArray(history)) return [];

        return history.slice(-10);
    } else {
        await docRef.set({ history: [] });
        return [];
    }
}

export const add = async (waId, { role, content }) => {
    const docRef = collection.doc(waId);

    // Convert content to Gemini API format
    const message = {
        role,
        parts: [{ text: content }]
    };

    const doc = await docRef.get();
    if (doc.exists) {
        const data = doc.data();
        try {
            const updatedHistory = data.history && Array.isArray(data.history) ?
                [...data.history, message] :
                [message];
            await docRef.update({ history: updatedHistory });
        } catch (err) {
            console.error("Error updating history:", err);
        }
    } else {
        await docRef.set({ history: [message] });
    }
}
