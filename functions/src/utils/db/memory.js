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

export const add = async (waId, newMemory) => {
    const collection = db.collection("memory");

    const docRef = collection.doc(waId);
    if (!docRef) {
        collection.add({ waId, memory: newMemory });
        return;
    }

    const doc = await docRef.get();
    if (doc.exists) {
        const updatedMemory = doc.data().memory && doc.data().memory.trim() !== "" ?
            `${doc.data().memory}\n${newMemory}` :
            newMemory;
        await docRef.update({ memory: updatedMemory });
    } else {
        await docRef.set({ memory: newMemory });
    }
}
