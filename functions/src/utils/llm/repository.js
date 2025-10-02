import { get as askToLlm } from "./content.js";

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

Si el usuario no proporciona suficiente informacion y tu no puedes inferirla para completar los campos obligatorios, asigna el type a "general" y agrega un campo adicional "reason" explicando que informacion falta.

Ejemplos:
Usuario: "Dime sobre el repositorio facebook/react"
Respuesta: {"type": "repository", "owner": "facebook", "repo": "react", "filePath": null}

Usuario: "Muéstrame el código del archivo src/app.js del repo microsoft/vscode"
Respuesta: {"type": "file", "owner": "microsoft", "repo": "vscode", "filePath": "src/app.js"}

Usuario: "Hola, ¿cómo estás?"
Respuesta: {"type": "general", "owner": null, "repo": null, "filePath": null}

Usuario: "Háblame del repositorio vuejs"
Respuesta: {"type": "general", "owner": null, "repo": null, "filePath": null, "reason": "Falta el propietario del repositorio"}

Ahora responde a la siguiente pregunta del usuario:

Pregunta: "${prompt}"
Respuesta en JSON.
`, userMemory);

    try {
        /**
         * @type {{
         * type: string, 
         * owner: string | null,
         * repo: string | null,
         * filePath: string | null,
         * reason?: string
         * }}
         */
        const params = JSON.parse(llmResponse.text);

        if (!params.type) return null;

        return params;
    } catch (_) {
        return null;
    }
}
