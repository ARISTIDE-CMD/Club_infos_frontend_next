// lib/typesense.ts
import Typesense from 'typesense';

export const client = new Typesense.Client({
  nodes: [
    {
      host: 'localhost',
      port: 8108,
      protocol: 'http'
    }
  ],
  apiKey: 'aris12345',
  connectionTimeoutSeconds: 5
});

export async function searchStudents(query: string) {
  const searchParameters = {
    q: query,
    query_by: 'first_name,last_name,student_id,class_group',
    per_page: 10
  };

  const results = await client.collections('students').documents().search(searchParameters);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return results?.hits?.map((hit: any) => hit.document);
}
