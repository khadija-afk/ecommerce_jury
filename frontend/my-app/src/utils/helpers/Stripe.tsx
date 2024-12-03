const API_BASE_URL = import.meta.env.VITE_CORS_URL; // Définissez l'URL de base de votre API ici

interface FetchOptions {
  method?: string;
  body?: any;
  credentials?: RequestCredentials;
  headers?: Record<string, string>; // Ajout de headers personnalisés
}

export async function fetchFromApi(
  endpoint: string,
  opts: FetchOptions = {}
): Promise<any> {
  const { method = 'POST', body = null, credentials = 'same-origin', headers = {} } = opts;

  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method,
      ...(body && { body: JSON.stringify(body) }),
      headers: {
        'Content-Type': 'application/json',
        ...headers, // Fusionne les headers par défaut avec ceux personnalisés
      },
      credentials,
    });

    console.log(`Response status: ${res.status}`);
    const text = await res.text();
    console.log(`Response text: ${text}`);

    if (!res.ok) {
      // Gère les erreurs HTTP en récupérant un message spécifique si disponible
      const errorData = text ? JSON.parse(text) : {};
      throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
    }

    // Tente de parser le JSON si possible
    return text ? JSON.parse(text) : null;
  } catch (error: any) {
    console.error(`Erreur lors de l'appel API : ${error.message}`);
    throw error;
  }
}
