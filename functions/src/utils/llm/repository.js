import { get as askToLlm } from "./content.js";
import { getData as getRepositoryData } from "../github/repository.js";
import { getData as getFileData } from "../github/file.js";

/**
 * @param {string} prompt 
 * @param {string} userMemory 
 * @returns
 */
export const getParamsFromPrompt = async (prompt, userMemory) => {
    const llmResponse = await askToLlm(`\
Eres un asistente que extrae informacion sobre codigo de repositorios de GitHub, y puedes responder a preguntas sobre el codigo de un repositorio de GitHub o archivos especificos del repostorio.
Extrae la informacion en formato JSON con las siguientes claves:
- type: "repository" si la pregunta es sobre un repositorio en general, "file" si la pregunta es sobre un archivo especifico, o "general" si no es ninguna de las anteriores.
- owner: el propietario del repositorio (obligatorio si type es "repository" o "file", null en otro caso).
- repo: el nombre del repositorio (obligatorio si type es "repository" o "file", null en otro caso).
- filePath: la ruta del archivo dentro del repositorio (obligatorio si type es "file", null en otro caso).

Si el usuario no proporciona suficiente informacion, intenta inferirla con una busqueda, y si no lo logras para completar los campos obligatorios, asigna el type a "general" y agrega un campo adicional "reason" explicando que informacion falta.

Ejemplos:
Usuario: "Dime sobre el repositorio facebook/react"
Respuesta: {"type": "repository", "owner": "facebook", "repo": "react", "filePath": null}

Usuario: "Muéstrame el código del archivo src/app.js del repo microsoft/vscode"
Respuesta: {"type": "file", "owner": "microsoft", "repo": "vscode", "filePath": "src/app.js"}

Usuario: "Dame informacion sobre el repo de Linux"
Respuesta: {"type": "repository", "owner": "torvalds", "repo": "linux", "filePath": null}

Usuario: "Dame el codigo del archivo ignore de git del repo react"
Respuesta: {"type": "file", "owner": "facebook", "repo": "react", "filePath": ".gitignore"}

Usuario: "Hola, ¿cómo estás?"
Respuesta: {"type": "general", "owner": null, "repo": null, "filePath": null}

Usuario: "Háblame del repositorio vuejs"
Respuesta: {"type": "general", "owner": null, "repo": null, "filePath": null, "reason": "Falta el propietario del repositorio"}

Ahora responde a la siguiente pregunta del usuario:

Pregunta: "${prompt}"

Dame la respuesta solo en formato JSON, sin explicaciones adicionales.
`, userMemory);

    try {
        const llmResponseJson = llmResponse.text.trim().replace(/^\s*```json\s*/, "").replace(/\s*```\s*$/, "");

        /**
         * @type {{
         * type: string, 
         * owner: string | null,
         * repo: string | null,
         * filePath: string | null,
         * reason?: string
         * }}
         */
        const params = JSON.parse(llmResponseJson);

        return params;
    } catch (_) {
        console.error("Error parsing LLM response:", llmResponse.text);

        return null;
    }
}

export const getRepositoryInfo = async (userPrompt, userMemory, owner, repo, authToken) => {
    const data = await getRepositoryData(owner, repo, authToken);

    if (!data) {
        return {
            text: "No se pudo obtener la información del repositorio en este momento."
        }
    };

    if (data.status === 404 || data.status === "404") {
        return {
            text: `No se encontró el repositorio ${owner}/${repo}.`
        };
    }

    const sanitizedData = {
        ...data,
        forks_url: undefined,
        keys_url: undefined,
        collaborators_url: undefined,
        teams_url: undefined,
        hooks_url: undefined,
        issue_events_url: undefined,
        events_url: undefined,
        assignees_url: undefined,
        branches_url: undefined,
        tags_url: undefined,
        blobs_url: undefined,
        git_tags_url: undefined,
        git_refs_url: undefined,
        statuses_url: undefined,
        stargazers_url: undefined,
        subscribers_url: undefined,
        subscription_url: undefined,
        compare_url: undefined,
        merges_url: undefined,
        archive_url: undefined,
        milestones_url: undefined,
        labels_url: undefined,
    }

    const response = await askToLlm(`
Eres un asistente que extrae informacion sobre codigo de repositorios de GitHub, y puedes responder a preguntas sobre el codigo de un repositorio de GitHub o archivos especificos del repostorio.

El repositorio tiene la siguiente informacion: ${JSON.stringify(sanitizedData)}
El usuario pregunta: ${userPrompt}

Responde a la pregunta del usuario basandote en la informacion del repositorio. Si no puedes responder a la pregunta con la informacion del repositorio, responde "No puedo responder a esa pregunta con la informacion disponible del repositorio.".

Dame la respuesta en formato texto, sin explicaciones adicionales.
`, userMemory);

    if (!response) {
        return {
            text: "No se pudo procesar la solicitud en este momento."
        }
    }

    return response;
}

export const getFileInfo = async (userPrompt, userMemory, owner, repo, filePath, authToken) => {
    const data = await getFileData(owner, repo, filePath, authToken);

    if (!data) {
        return {
            text: "No se pudo obtener la información del archivo en este momento."
        };
    }

    if (data.status === 404 || data.status === "404") {
        return {
            text: `No se encontró el archivo ${filePath} en el repositorio ${owner}/${repo}.`
        };
    }

    const sanitizedData = { ...data }

    const response = await askToLlm(`
Eres un asistente que extrae informacion sobre codigo de repositorios de GitHub, y puedes responder a preguntas sobre el codigo de un repositorio de GitHub o archivos especificos del repostorio.

El usuario pregunta: ${userPrompt}
El archivo tiene la siguiente informacion: ${JSON.stringify(sanitizedData)}

Responde a la pregunta del usuario basandote en la informacion del archivo. Si no puedes responder a la pregunta con la informacion del archivo, responde "No puedo responder a esa pregunta con la informacion disponible del archivo.".`);

    if (!response) {
        return {
            text: "No se pudo procesar la solicitud en este momento."
        }
    }

    return response;
}
