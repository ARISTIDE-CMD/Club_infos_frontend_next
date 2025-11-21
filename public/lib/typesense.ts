// lib/search.ts
// Requête vers le endpoint Laravel /api/search/students (proxy sécurisé)

export async function searchStudents(query: string) {
  const url = `/api/search/students?q=${encodeURIComponent(query)}&per_page=50`;
  const res = await fetch(url, {
    method: 'GET',
    // Si votre API utilise cookies / sanctum :
    credentials: 'include'
    // Sinon, si vous utilisez Bearer token, ajoutez l'en-tête Authorization ci-dessous :
    // headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Search failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  // Typesense retourne { hits: [{ document: {...} }], fo
  // und, ... }
  return (data.hits || []).map((h: any) => h.document);
}