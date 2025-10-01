import { db } from "../../lib/firebase.js";

export const get = async (waId) => {
    const docRef = db.collection("memory").doc(waId);

    const doc = await docRef.get();

    if (doc.exists) {
        return doc.data().memory || "";
    } else {
        return "";
    }
};
