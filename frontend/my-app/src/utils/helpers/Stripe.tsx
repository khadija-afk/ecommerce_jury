const API = '';

export async function fetchFromApi(endpoint, opts) {
    const { method, body } = { method: 'POST', body: null, ...opts };

    const res = await fetch(`${API}/${endpoint}`, {
        method,
        ...(body && { body: JSON.stringify(body) }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Inclure les cookies dans la requête
    });

    console.log(`Response status: ${res.status}`);
    const text = await res.text();
    console.log(`Response text: ${text}`);

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        throw new Error(`Failed to parse JSON: ${error.message}`);
    }
}
