'use client';

import React from 'react';
import { InstantSearch, Configure } from 'react-instantsearch';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { assembleTypesenseServerConfig } from '@/public/utils/typesense';
import {proxySearchClient} from '@/public/lib/instantsearchProxyClient';


import { SearchInput } from './SearchInput';
import { HitsList} from './HitList';
import { PaginationControls } from './PaginationControls';

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: assembleTypesenseServerConfig(),
  additionalSearchParameters: {
    query_by: 'first_name,last_name,class_group',
  },
});

export default function StudentSearch() {
  return (
    <div className="max-w-xl mx-auto mt-8">
      <InstantSearch
        indexName="students"
        searchClient={proxySearchClient}
      >
        <Configure hitsPerPage={50} />

        <SearchInput placeholder="Rechercher un étudiant…" classNames={{
          root: "w-full",
          form: "flex items-center bg-gray-100 rounded-md overflow-hidden",
          input: "flex-1 px-4 py-2 bg-transparent focus:outline-none",
        }} />

        <HitsList />

        <PaginationControls />
      </InstantSearch>
    </div>
  );
}
