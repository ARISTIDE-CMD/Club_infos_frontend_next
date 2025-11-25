// lib/utils/typesenseConfig.ts

export function assembleTypesenseAdminConfig() {
  const host = process.env.TYPESENSE_HOST;
  const port = process.env.TYPESENSE_PORT;
  const protocol = process.env.TYPESENSE_PROTOCOL;
  const apiKey = process.env.TYPESENSE_ADMIN_API_KEY;

  if (!host || !port || !protocol || !apiKey) {
    console.error("Les variables d'environnement Typesense ADMIN sont manquantes.");
  }

  return {
    apiKey,
    nodes: [
      {
        host,
        port,
        protocol,
      },
    ],
    numRetries: 8,
    connectionTimeoutSeconds: 1,
  };
}

export function assembleTypesenseServerConfig() {
  const host = process.env.NEXT_PUBLIC_TYPESENSE_HOST;
  const port = process.env.NEXT_PUBLIC_TYPESENSE_PORT;
  const protocol = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL;
  const apiKey = process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY;

  if (!host || !port || !protocol || !apiKey) {
    console.error("Les variables d'environnement Typesense SEARCH sont incomplètes.");
  }

  return {
    apiKey,
    nodes: [
      {
        host,
        port,
        protocol,
      },
    ],
    // Mettre en cache les résultats pendant 120s (par exemple)
    cacheSearchResultsForSeconds: 120,
    numRetries: 8,
    connectionTimeoutSeconds: 10,
    // Si tu veux faire du "server-side cache", tu peux ajouter :
    // useServerSideSearchCache: true
  } as const; // "as const" peut aider à préserver les types littéraux si besoin
}
