import React, { useEffect, useRef } from 'react';
import { autocomplete, AutocompleteOptions, BaseItem } from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';

import { useInstantSearch } from 'react-instantsearch';

export function AutocompleteBox() {
  const { refine, uiState, setUiState } = useInstantSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const autocompleteInstance = autocomplete({
      container: containerRef.current,
      placeholder: 'Rechercher un étudiant…',
      openOnFocus: true,
      onStateChange({ state, prevState }) {
        if (state.query !== prevState.query) {
          // Met à jour InstantSearch avec la nouvelle query
          setUiState({ ...uiState, query: state.query });
        }
      },
      onSubmit({ state }) {
        setUiState({ ...uiState, query: state.query });
      },
      // Facultatif — tu peux personnaliser l’affichage des suggestions
      getSources() {
        return [
          {
            sourceId: 'students',
            getItems: () => {
              // use InstantSearch refine() / usages par défaut
              return [];
            },
            templates: {
              item({ item }) {
                return <div>{item.first_name} {item.last_name}</div>;
              },
            },
          },
        ];
      },
    });

    return () => autocompleteInstance.destroy();
  }, [setUiState, uiState]);

  return <div ref={containerRef} />;
}
