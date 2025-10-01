import { db } from "../../lib/firebase.js";

export const get = async (waId) => {
    const collection = db.collection("memory");

    const docRef = collection.doc(waId);
    if (!docRef) {
        collection.add({ waId, memory: "" });
        return "";
    }

    const doc = await docRef.get();
    if (doc.exists) {
        return doc.data().memory || "";
    } else {
        docRef.set({ memory: "" });
        return "";
    }
};
