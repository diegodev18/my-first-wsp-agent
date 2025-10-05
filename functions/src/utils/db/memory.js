import { db } from "../../lib/firebase.js";
import { promptNewMemory } from "../llm/prompt.js";
import { get as askToLlm } from "../llm/ask.js";

const collection = db.collection("memory");

export const get = async (waId) => {
    const docRef = collection.doc(waId);
    if (!docRef) {
        await collection.add({ waId, memory: "" });
        return "";
    }

    const doc = await docRef.get();
    if (doc.exists) {
        return doc.data().memory || "";
    } else {
        await docRef.set({ memory: "" });
        return "";
    }
};

export const add = async (waId, userPrompt) => {
    const currentMemory = await get(waId);

    const newMemory = await askToLlm(promptNewMemory(userPrompt, currentMemory), [], false);

    if (!newMemory || !newMemory.text || newMemory.text === "none") {
        return;
    }

    const docRef = collection.doc(waId);
    if (!docRef) {
        await collection.add({ waId, memory: newMemory.text });
        return;
    }

    const doc = await docRef.get();
    if (doc.exists) {
        const updatedMemory = doc.data().memory && doc.data().memory.trim() !== "" ?
            `${doc.data().memory}\n${newMemory.text}` :
            newMemory.text;
        await docRef.update({ memory: updatedMemory });
    } else {
        await docRef.set({ memory: newMemory.text });
    }
}
