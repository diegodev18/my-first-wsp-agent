
export const fetchData = async (url, authToken = null) => {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    const response = await fetch(url, { headers });

    if (!response.ok) return null;

    const data = await response.json();

    return data;
}
