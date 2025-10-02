
export const getData = async (owner, repositoryName, filePath) => {
    const url = `https://api.github.com/repos/${owner}/${repositoryName}/contents/${filePath}`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();

    return data;
}
