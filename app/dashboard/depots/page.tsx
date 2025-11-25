'use client';

import React from 'react';
import { InstantSearch, SearchBox, Hits, Pagination, Configure } from 'react-instantsearch';
// import proxySearchClient from './instantsearchProxyClient' // unused
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
// searchStudents is not used here; we rely on typesense-instantsearch-adapter directly

import {proxySearchClient} from '@/public/lib/instantsearchProxyClient';
import {assembleTypesenseServerConfig} from '@/public/utils/typesense';
// Exemple en JS / node
import Typesense from 'typesense';

const client = new Typesense.Client({
  nodes: [{ host: 'localhost', port: 8108, protocol: 'http' }],
  apiKey: 'xyz', // ta clé admin ou bootstrap
});

async function createSearchKey() {
  const key = await client.keys().create({
    description: 'Search + multi_search key pour frontend',
    actions: ['documents:search'], // permet de chercher
    collections: ['students'], // ou un pattern
    expires_at: 0, // 0 = n’expire pas, ou un timestamp unix
  });

  console.log('Nouvelle clé :', key);
}

createSearchKey();


type StudentHitProps = {
  hit: {
    id: string;
    first_name: string;
    last_name: string;
    class_group: string;
    __position: number;
  };
};

const typesenseServerConfig = assembleTypesenseServerConfig();

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: typesenseServerConfig,
  additionalSearchParameters: {
    query_by: 'first_name,last_name,class_group',
  },
});


function StudentHit({ hit }: { hit: StudentHitProps['hit'] }) { 
  {console.log(hit)}
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
      <InstantSearch indexName="students" searchClient={proxySearchClient}>
        <Configure hitsPerPage={50} />

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

        <ul className="space-y-2">
          <Hits<StudentHitProps['hit']> hitComponent={StudentHit} classNames={{
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
