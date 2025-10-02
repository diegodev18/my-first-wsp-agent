
/**
 * @param {string} url 
 * @param {null | string} authToken 
 * @returns {Promise<null | Object>}
 */
export const fetchData = async (url, authToken = null) => {
    const headers = authToken ? { Authorization: `token ${authToken}` } : {};
    const response = await fetch(url, { headers });

    if (!response.ok) return null;

    const data = await response.json();

    return data;
}
