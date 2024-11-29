const API = '';

export async function fetchFromApi(endpoint: string, opts: { method?: string; body?: any; credentials?: RequestCredentials } = {}) {
    const { method, body, credentials } = { method: 'POST', body: null, credentials: "same-origin", ...opts };

    const res = await fetch(`${API}/${endpoint}`, {
        method,
        ...(body && { body: JSON.stringify(body) }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials, // Inclure les cookies dans la requête
    });

    console.log(`Response status: ${res.status}`);
    const text = await res.text();
    console.log(`Response text: ${text}`);

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    try {
        return JSON.parse(text);
    } catch (error: any) {
        throw new Error(`Failed to parse JSON: ${error.message}`);
    }
}

