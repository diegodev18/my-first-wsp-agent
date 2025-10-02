import { fetchData as fetchGithubData } from "./api";

export const getData = async (owner, repositoryName, authToken) => {
    const url = `https://api.github.com/repos/${owner}/${repositoryName}`;

    const data = await fetchGithubData(url, authToken);

    return data;
}
