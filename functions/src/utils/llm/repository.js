import { get as askToLlm } from "./ask.js";
import { getData as getRepositoryData } from "../github/repository.js";
import { getData as getFileData } from "../github/file.js";
import { promptParams, promptRepositoryInfo, promptFileInfo } from "./prompt.js";

/**
 * @param {string} prompt 
 * @param {string} userMemory 
 * @returns
 */
export const getParamsFromPrompt = async (prompt, userMemory, history) => {
    const llmResponse = await askToLlm(promptParams(prompt, userMemory), history);

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

    const response = await askToLlm(promptRepositoryInfo(userPrompt, sanitizedData, userMemory));

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

    const response = await askToLlm(promptFileInfo(userPrompt, JSON.stringify(sanitizedData), userMemory));

    if (!response) {
        return {
            text: "No se pudo procesar la solicitud en este momento."
        }
    }

    return response;
}
