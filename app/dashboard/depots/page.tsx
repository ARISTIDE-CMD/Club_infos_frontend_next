'use client'
// Charte graphique: Bleu #092c74 (primaire) et Jaune #fdbd00 (accent)

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { SearchBox, Hits, useInstantSearch, InstantSearch, Configure } from "react-instantsearch"
import api from "@/api"
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter"

type HitProps = {
    hit: {
        id: number,
        author: string,
        download_url: any,
        width: number,
        height: number
    }
}

const typesenseInstantSearchAdapter = new TypesenseInstantsearchAdapter({
    server: {
        apiKey: 'xyz',
        nodes: [
            {
                protocol: 'http',
                port: 8108,
                host: 'localhost'
            }
        ]
    },
    additionalSearchParameters: {
        query_by: 'author'
    }
})

const recents = [
    {
        id: 0,
        author: 'Alejandro Escamilla',
        width: 5616,
        height: 3744,
        url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
        download_url: 'https://picsum.photos/id/0/5616/3744'
    },
    {
        id: 1,
        author: 'John Doe',
        width: 5000,
        height: 3333,
        url: 'https://unsplash.com/photos/example',
        download_url: 'https://picsum.photos/id/1/5000/3333'
    },
    {
        id: 2,
        author: 'Jane Smith',
        width: 6000,
        height: 4000,
        url: 'https://unsplash.com/photos/example2',
        download_url: 'https://picsum.photos/id/2/6000/4000'
    },
    {
        id: 7,
        author: 'Frank Green',
        width: 5300,
        height: 3600,
        url: 'https://unsplash.com/photos/example7',
        download_url: 'https://picsum.photos/id/7/5300/3600'
    },
    {
        id: 3,
        author: 'Alice',
        width: 4000,
        height: 6000,
        url: 'https://unsplash.com/photos/example3',
        download_url: 'https://picsum.photos/id/3/4000/6000'
    },

]

const populate = [
    {
        id: 3,
        author: 'Alice',
        width: 4000,
        height: 6000,
        url: 'https://unsplash.com/photos/example3',
        download_url: 'https://picsum.photos/id/3/4000/6000'
    },
    {
        id: 4,
        author: 'Bob Brown',
        width: 4500,
        height: 3000,
        url: 'https://unsplash.com/photos/example4',
        download_url: 'https://picsum.photos/id/4/4500/3000'
    },
    {
        id: 5,
        author: 'Charlie Davis',
        width: 4800,
        height: 3200,
        url: 'https://unsplash.com/photos/example5',
        download_url: 'https://picsum.photos/id/5/4800/3200'
    },
    {
        id: 6,
        author: 'Eve White',
        width: 5200,
        height: 3500,
        url: 'https://unsplash.com/photos/example6',
        download_url: 'https://picsum.photos/id/6/5200/3500'
    },
]

const SearchUIContext = createContext({
    isOpen: false,
    setIsOpen: (_: boolean) => { }
});

const useSearchUI = () => useContext(SearchUIContext);

const SearchInput = () => {
    const { setIsOpen } = useSearchUI();

    return (
        <div className="w-full max-w-md mx-auto">
            <SearchBox
                onFocus={() => setIsOpen(true)}
                classNames={{
                    root: "w-full",
                    form: "relative flex items-center border-1 border-yellow-500 rounded-full overflow-hidden shadow-sm transition-all duration-300",
                    input: "flex-grow px-4 py-3 pr-14 outline-none text-gray-700 placeholder-gray-400 border-yellow-500",
                    submit: "absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white rounded-full border-2 transition-colors duration-200 bg-yellow-300",
                    reset: "absolute right-12 top-1/2 -translate-y-1/2 hover:text-gray-600 transition-colors duration-150",
                }}
                placeholder="Rechercher des produits..."
                style={{
                    '--search-border': '#092c74',
                    '--submit-bg': '#092c74',
                    '--submit-hover': '#0a3d99',
                    '--reset-color': '#6b7280'
                } as React.CSSProperties}
            />
            <style jsx>{`
                .ais-SearchBox-form {
                    border-color: var(--search-border) !important;
                }
                .ais-SearchBox-form:focus-within {
                    ring-color: #092c74;
                    box-shadow: 0 0 0 3px rgba(9, 44, 116, 0.1);
                }
                .ais-SearchBox-submit {
                    background-color: var(--submit-bg) !important;
                }
                .ais-SearchBox-submit:hover {
                    background-color: var(--submit-hover) !important;
                }
                .ais-SearchBox-reset {
                    color: var(--reset-color) !important;
                }
            `}</style>
        </div>
    );
};

const HitsList = ({ hit }: { hit: HitProps['hit'] }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className={`bg-white w-full h-auto rounded-md overflow-hidden w-64 ${loaded ? "border border-gray-200" : ""}`}>
            {!loaded && (
                <div className="w-full h-60 bg-gray-200 animate-pulse rounded-md"></div>
            )}
            <div className={`w-64 h-60 ${loaded ? "block" : "hidden"}`}>
                <img
                    src={hit.download_url}
                    alt={hit.author}
                    className="w-full h-40 object-cover"
                    onLoad={() => setLoaded(true)}
                />
                <div className="p-2">
                    <h4 className="text-sm font-semibold" style={{ color: '#092c74' }}>
                        {hit.author}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">Disponible</p>
                    <p className="mt-1 flex items-center gap-2 text-yellow-400">
                        <span className="text-xs font-bold text-yellow-600">200 Fcfa</span>
                        <span className="text-xs line-through text-gray-400">500 Fcfa</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const highlightQuery = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
        regex.test(part) ? (
            <span key={index} className="font-semibold">
                {part}
            </span>
        ) : (
            <span key={index}>{part}</span>
        )
    );
};

const componentsResults = () => {
    return (
        <>
            <div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: '#092c74' }}>
                    Recherches populaires
                </h4>
                <ul className="grid grid-cols-3 gap-5">
                    {recents.map((pic) => {
                        const firstWord = pic.author.split(' ')[0];
                        return (
                            <li
                                key={pic.id}
                                className="p-2 rounded-2xl bg-white border font-semibold text-center transition-colors duration-200"
                                style={{
                                    borderColor: '#092c74',
                                    color: '#092c74'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fdbd00';
                                    e.currentTarget.style.color = '#092c74';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = '#092c74';
                                }}
                            >
                                {firstWord}
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className="overflow-x-auto scrollbar-hide py-4">
                <div className="flex gap-4">
                    {populate.map((element) => (
                        <div
                            key={element.id}
                            className="flex-shrink-0 bg-white rounded-md overflow-hidden border shadow-sm w-52 md:w-48 transition-all duration-200 hover:shadow-md"
                            style={{ borderColor: '#092c74' }}
                        >
                            <img
                                src={element.download_url}
                                alt={element.author}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-3">
                                <h4 className="text-sm font-medium" style={{ color: '#092c74' }}>
                                    {element.author}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button
                className="mb-4 mt-4 px-4 py-2 text-white rounded-md transition-all duration-200 hover:shadow-lg"
                style={{
                    backgroundColor: '#092c74',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0a3d99';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#092c74';
                }}
            >
                Voir +500
            </button>
        </>
    )
}

const SearchResultsBlock = () => {
    const { isOpen } = useSearchUI();
    const { indexUiState } = useInstantSearch();
    const query = indexUiState.query as string;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const input = containerRef.current.querySelector<HTMLInputElement>("input");
            if (input) input.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className={`max-w-4xl mx-auto px-3 overflow-hidden rounded-2xl transition-all duration-500 ${isOpen ? "max-h-[1000px] opacity-100 w-full" : "max-h-0 opacity-0"
                }`}
            ref={containerRef}
        >
            <div className="bg-white rounded-2xl space-y-4">
                <SearchBox
                    classNames={{
                        root: "mt-3 mx-3 sm:mx-0",
                        form: "relative flex items-center border-2 border-yellow-500 rounded-full overflow-hidden shadow-md transition-all duration-300",
                        input: "flex-grow px-4 py-3 pr-14 outline-none text-gray-700 placeholder-gray-400",
                        submit: "absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white transition-colors duration-200 rounded-full bg-yellow-300",
                        reset: "absolute right-12 top-1/2 -translate-y-1/2 transition-colors duration-150 p-2 rounded-full hover:bg-gray-200  hover:opacity-75",
                    }}
                    placeholder="Rechercher un produit..."
                />
                <style jsx>{`
                    .ais-SearchBox-form {
                        border-color: #fdbd00 !important;
                    }
                    .ais-SearchBox-submit {
                        background-color: #092c74 !important;
                    }
                    .ais-SearchBox-submit:hover {
                        background-color: #0a3d99 !important;
                    }
                    .ais-SearchBox-reset {
                        color: #fdbd00 !important;
                    }
                    .ais-SearchBox-reset:hover {
                        background-color: #fdbd00 !important;
                        color: #092c74 !important;
                    }
                `}</style>

                {query ? (
                    <>
                        <div className="">
                            <h4 className="font-semibold" style={{ color: '#092c74' }}>
                                Résultats pour : <span style={{ color: '#fdbd00' }}>"{query}"</span>
                            </h4>
                            <Hits
                                hitComponent={({ hit }: HitProps) => (
                                    <div
                                        className="p-1 hover:rounded-md hover:border opacity-90 transition-colors duration-150"
                                        style={{
                                            '--hover-bg': 'rgba(253, 189, 0, 0.1)',
                                            '--hover-border': '#fdbd00'
                                        } as React.CSSProperties}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(253, 189, 0, 0.1)';
                                            e.currentTarget.style.borderColor = '#fdbd00';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        {highlightQuery(hit.author, query)}
                                    </div>
                                )}
                                classNames={{
                                    list: "grid grid-cols-1 sm:grid-cols-2 gap-2",
                                }}
                            />
                            {componentsResults()}
                        </div>
                    </>
                ) : (
                    <Default />
                )}
            </div>
        </div>
    );
};

// Components of default view
const recentComponent = () => {
    const [picturesRecents, setPicturesRecents] = useState<typeof recents>([]);

    useEffect(() => {
        const recentCache = localStorage.getItem("pictureRecents_cach");
        if (recentCache !== null) {
            // Le cache existe (même vide), on l'utilise
            setPicturesRecents(JSON.parse(recentCache));
            console.log("récent", JSON.parse(recentCache));
        } else {

            localStorage.setItem("pictureRecents_cach", JSON.stringify(recents));
            setPicturesRecents(recents);
            console.log(recents)
        }
    }, [])
const removeRecentSearch = () => {
        setPicturesRecents([]);
        localStorage.setItem("pictureRecents_cach", JSON.stringify([]));
    }

    const handleDelete = (id: number) => {
        const updatedItems = picturesRecents.filter(item => item.id !== id);
        setPicturesRecents(updatedItems);
        localStorage.setItem("pictureRecents_cach", JSON.stringify(updatedItems));
    };
    return (
        <div>
            <div className="flex items-center justify-start">
                <h4 className="text-lg font-semibold mr-3" style={{ color: '#092c74' }}>
                    Mes recherches récentes
                </h4>
                <p className="text-sm block underline hover:opacity-75 cursor-pointer transition-colors duration-150"
                    style={{ color: '#fdbd00' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e5a800'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#fdbd00'}
                >
                    <button
                    // onClick={removeRecentSearch}
                    >Tout effacer</button>
                </p>
            </div>
            <ul className="space-y-2">
                {picturesRecents.length > 0 ? picturesRecents.slice(0, 2).map((pic) => (
                    <p
                        key={pic.id}
                        className="flex justify-between items-center cursor-pointer hover:rounded-md px-2 transition-all duration-150"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(253, 189, 0, 0.1)';
                            e.currentTarget.style.borderColor = '#fdbd00';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <li className="transition-colors duration-150"
                            onMouseEnter={(e) => e.currentTarget.style.color = '#092c74'}
                        >
                            {pic.author}
                        </li>
                        <button
                            className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-150"
                            style={{ color: '#092c74' }}
                            // onClick={() => handleDelete(pic.id)}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#fdbd00'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#092c74'}
                        >
                            ✕
                        </button>
                    </p>
                )) : (
                    <p className="text-gray-500 opacity-50">Aucune recherche récente</p>
                )}
            </ul>
        </div>
    )
}
const populateComponent = () => {
    const [picturesPopulate, setPicturesPopulate] = useState<typeof populate>([]);
    useEffect(() => {
        const populatCache = localStorage.getItem("picturePopulate_cach");
        if (populatCache !== null) {
            setPicturesPopulate(JSON.parse(populatCache));
        } else {
            localStorage.setItem("picturePopulate_cach", JSON.stringify(populate));
            setPicturesPopulate(populate);
        }
    }, [])

    return (
        <div>
            <h4 className="text-lg font-semibold" style={{ color: '#092c74' }}>
                Recherches populaires
            </h4>
            <ul className="space-y-2">
                {picturesPopulate.map((pic) => (
                    <li
                        key={pic.id}
                        className="cursor-pointer hover:rounded-md px-2 py-1 transition-all duration-150"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(253, 189, 0, 0.1)';
                            e.currentTarget.style.color = '#092c74';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'inherit';
                        }}
                    >
                        {pic.author}
                    </li>
                ))}
            </ul>
        </div>
    )
}
const topSell = () => {
    return (
        <div>
            <h4 className="sm:hidden text-lg font-semibold mb-3" style={{ color: '#092c74' }}>
                Top ventes
            </h4>
            <div className="sm:hidden overflow-x-auto scrollbar-hidden flex gap-4 py-2">
                <InstantSearch indexName="images" searchClient={typesenseInstantSearchAdapter.searchClient}>
                    <Configure hitsPerPage={6} />
                    <Hits
                        hitComponent={HitsList}
                        classNames={{
                            list: "flex gap-4",
                            item: "flex-shrink-0 w-40"
                        }}
                    />
                </InstantSearch>
            </div>
        </div>
    )
}
const topSellMoment = () => {
    return (
        <div className="hidden sm:flex sm:flex-col flex-1">
            <InstantSearch indexName="images" searchClient={typesenseInstantSearchAdapter.searchClient}>
                <h4 className="text-lg font-semibold mb-3" style={{ color: '#092c74' }}>
                    Top ventes du moment
                </h4>
                <Configure hitsPerPage={6} />
                <Hits
                    hitComponent={HitsList}
                    classNames={{
                        list: "grid grid-cols-3 gap-4",
                        item: ""
                    }}
                />
            </InstantSearch>
        </div>
    )
}
const marqueMoment = () => {
    const [picturesPopulate, setPicturesPopulate] = useState<typeof populate>([]);
    useEffect(() => {
        const populatCache = localStorage.getItem("picturePopulate_cach");
        if (populatCache !== null) {
            setPicturesPopulate(JSON.parse(populatCache));
        } else {
            localStorage.setItem("picturePopulate_cach", JSON.stringify(populate));
            setPicturesPopulate(populate);
        }
    }, [])

    return (
        <div className="mb-4">
            <h4 className="text-lg font-semibold mb-3" style={{ color: '#092c74' }}>
                Marques du moment
            </h4>
            <ul className="space-y-2 grid grid-cols-3 gap-5">
                {picturesPopulate.slice(0, 3).map((pic) => (
                    <li
                        key={pic.id}
                        className="cursor-pointer px-3 py-2 rounded-2xl bg-white border transition-all duration-200"
                        style={{ borderColor: '#092c74' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(253, 189, 0, 0.1)';
                            e.currentTarget.style.borderColor = '#fdbd00';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.borderColor = '#092c74';
                        }}
                    >
                        {pic.author}
                    </li>
                ))}
            </ul>
        </div>
    )
}
const categoryMoment = () => {
    const [picturesPopulate, setPicturesPopulate] = useState<typeof populate>([]);
    useEffect(() => {
        const populatCache = localStorage.getItem("picturePopulate_cach");
        if (populatCache !== null) {
            setPicturesPopulate(JSON.parse(populatCache));
        } else {
            localStorage.setItem("picturePopulate_cach", JSON.stringify(populate));
            setPicturesPopulate(populate);
        }
    }, [])
    return (
        <div>
            <h4 className="text-lg font-semibold mb-3" style={{ color: '#092c74' }}>
                Catégories du moment
            </h4>
            <ul className="grid grid-cols-2 gap-3">
                {picturesPopulate.map((pic) => (
                    <li
                        key={pic.id}
                        className="cursor-pointer w-full px-1 py-2 font-semibold rounded-full bg-white border text-center transition-all duration-200"
                        style={{
                            borderColor: '#092c74',
                            color: '#092c74'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fdbd00';
                            e.currentTarget.style.borderColor = '#fdbd00';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.borderColor = '#092c74';
                        }}
                    >
                        {pic.author}
                    </li>
                ))}
            </ul>
        </div>
    )
}


const Default = () => {
    return (
        <div className="bg-white min-h-[320px] w-full max-w-4xl mx-auto sm:rounded-2xl grid py-4 px-3">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full grid grid-cols-1 md:grid-cols-2">

                <div className="flex-1 space-y-4 w-auto">
                    {/* Mes recherches récentes */}
                    {recentComponent()}
                    {/* Recherches populaires */}
                    {populateComponent()}
                    {/* Top ventes mobile */}
                    {topSell()}
                    {/* Catégories du moment */}
                    {categoryMoment()}
                    {/* Marques du moment */}
                    {marqueMoment()}
                </div>
                {/* Right column: Top ventes desktop */}
                {topSellMoment()}
            </div>
        </div>
    )
}

export default function Racine() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!isOpen) return;
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, setIsOpen]);

    return (
        <SearchUIContext.Provider value={{ isOpen, setIsOpen }} >
            <div
                ref={containerRef}
                className="relative max-w-4xl mx-auto bg-white rounded-none md:rounded-tl-3xl md:rounded-tr-3xl md:rounded-bl-3xl md:rounded-br-3xl shadow-lg backdrop-blur-sm mt-4 min-h-fit"
                style={{ borderColor: '#092c74' }}
            >
                <InstantSearch indexName="images" searchClient={typesenseInstantSearchAdapter.searchClient}>
                    <Configure hitsPerPage={6} />
                    {!isOpen && <SearchInput />}
                    <SearchResultsBlock />

                    {/* Bouton retour mobile */}
                    <button
                        aria-label="Retour"
                        className={`md:hidden absolute top-4 left-2 p-2 rounded-full transition-all duration-200 ${isOpen ? '' : 'opacity-0 pointer-events-none'
                            }`}
                        style={{ color: '#092c74' }}
                        onClick={() => setIsOpen(false)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fdbd00';
                            e.currentTarget.style.color = '#092c74';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#092c74';
                        }}
                    >
                        ←
                    </button>
                </InstantSearch>
            </div>
        </SearchUIContext.Provider>
    );
}