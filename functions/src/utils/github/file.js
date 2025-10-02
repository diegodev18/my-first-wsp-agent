import { fetchData as fetchGithubData } from "./api";

export const getData = async (owner, repositoryName, filePath, authToken) => {
    const url = `https://api.github.com/repos/${owner}/${repositoryName}/contents/${filePath}`;
    const data = await fetchGithubData(url, authToken);

    return data;
}
