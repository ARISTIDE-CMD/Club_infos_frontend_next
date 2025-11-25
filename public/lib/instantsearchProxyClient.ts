// lib/instantsearchProxyClient.ts
import type { SearchClient, SearchRequest, SearchResponse } from 'instantsearch.js';
import { searchStudents } from './typesense';

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  class_group: string;
};

type StudentWithMeta = Student & {
  __position: number;
  __queryID?: string;
};

export const proxySearchClient: SearchClient = {
  async search(requests: SearchRequest[]) {
    const results = await Promise.all(
      requests.map(async (req) => {
        const { query = '', page = 0, hitsPerPage = 10 } = req.params as any;
        return await proxySearch(query, page, hitsPerPage);
      })
    );

    return { results };
  },

  async searchForFacetValues() {
    throw new Error('searchForFacetValues not implemented');
  },

  clearCache() {},
};

// Exported helper: encapsule la logique de recherche et pagination.
// Cela permet de garder `proxySearchClient` léger (la méthode `search`
// délègue ici) et d'utiliser `proxySearch` directement depuis d'autres
// composants si besoin.
export async function proxySearch(query = '', page = 0, hitsPerPage = 10) {
  const students = (await searchStudents(query)) as Student[];
  const start = page * hitsPerPage;
  const paginated = students.slice(start, start + hitsPerPage);
  const hits: StudentWithMeta[] = paginated.map((student: Student, idx: number) => ({
    ...student,
    __position: start + idx + 1,
  }));

  const resp = {
    hits,
    nbHits: students.length,
    page,
    nbPages: Math.ceil(students.length / hitsPerPage),
    hitsPerPage,
    query,
    processingTimeMS: 0,
  };

  return resp as unknown as SearchResponse<StudentWithMeta>;
}
