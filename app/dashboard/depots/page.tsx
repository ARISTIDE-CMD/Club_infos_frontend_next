'use client';

import { InstantSearch, SearchBox, Hits, Pagination, Configure, RefinementList, useInstantSearch } from 'react-instantsearch';
// import proxySearchClient from './instantsearchProxyClient' // unused
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
// searchStudents is not used here; we rely on typesense-instantsearch-adapter directly

// Exemple en JS / node
import Typesense from 'typesense';



type StudentHitProps = {
  hit: {
    id: string;
    first_name: string;
    last_name: string;
    class_group: string;
    __position: number;
  };
};

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'xyz',
    nodes: [
      {
        host: 'localhost',
        protocol: 'http',
        port: 8108
      }
    ]
  },
  additionalSearchParameters: {
    query_by: 'first_name, last_name,class_group'
  }
})

function StudentHit({ hit }: { hit: StudentHitProps['hit'] }) {
  { console.log(hit) }
  const { indexUiState } = useInstantSearch();
  const query = indexUiState.query as string;
  if (!query) {
    return null;
  }
  return (
    <li
      key={hit.id}
      className="p-4 mb-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
    >
      <div className="text-lg font-medium text-gray-800">
        {hit.first_name} {hit.last_name}
      </div>
      <div className="text-sm text-gray-500 mt-1">
        Groupe : {hit.class_group} <br />
        id : {hit.id}

      </div>
    </li>
  );

}


export default function StudentSearchInstantProxy() {
  return (
    <div className="max-w-xl mx-auto mt-8">
      <InstantSearch indexName="students" searchClient={typesenseInstantsearchAdapter.searchClient}>
        <Configure hitsPerPage={10} />
        <RefinementList attribute='class_group' />

        <div className="mb-6 w-full">
          <SearchBox
            placeholder="Rechercher un étudiant…"
            classNames={{
              root: "w-full",
              form: "flex items-center bg-gray-100 rounded-md overflow-hidden",
              input: "flex-1 px-4 py-2 bg-transparent focus:outline-none",
              // submit: "px-4 py-2 bg-blue-600 text-white hover:bg-blue-700",
            }}
          />
        </div>
        {/* <RefinementList attribute="class_group" /> */}
        <ul className="space-y-2">
          <Hits  hitComponent={StudentHit} classNames={{
            list: "ais-Hits-list",
            item: "ais-Hits-item",
          }} />
        </ul>

        <div className="mt-6 flex justify-center">
          <Pagination
            classNames={{
              list: "flex space-x-2",
              item: "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300",
              link: "focus:outline-none",
              selectedItem: "bg-blue-600 text-white",
            }}
          />

        </div>
      </InstantSearch>
    </div>
  );
}