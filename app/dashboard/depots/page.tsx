'use client'
// import Image from "next/image"
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
                host: '192.168.1.209'
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

]

const populate = [
    {
        id: 3,
        author: 'Alice Johnson',
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
                    /* Keep form relative and overflow-hidden so absolute buttons don't overflow rounded corners */
                    form: "relative flex items-center border-2 border-purple-300 rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-purple-400 transition-all duration-300",
                    /* add right padding to allow submit/reset absolute buttons to sit inside */
                    input: "flex-grow px-4 py-3 pr-14 outline-none text-gray-700 placeholder-gray-400",
                    submit: "absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200",
                    reset: "absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150",
                }}
                placeholder="Rechercher des images..."
            />
        </div>
    );
};



const HitsList = ({ hit }: { hit: HitProps['hit'] }) => {
    return (
        <div className="bg-white rounded-md overflow-hidden border border-purple-100 shadow-sm w-full">
            <img src={hit.download_url} alt={hit.author} className="w-full h-40 object-cover" />
            <div className="p-3">
                <h4 className="text-sm font-medium text-purple-800">{hit.author}</h4>
            </div>
        </div>
    );
};

const highlightQuery = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi"); // insensible à la casse
    const parts = text.split(regex);

    return parts.map((part, index) =>
        regex.test(part) ? (
            <span key={index} className="bg-yellow-200 text-purple-800 font-semibold">
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
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Recherches populaires</h3>
                <ul className="grid grid-cols-4 gap-5">
                    {recents.map((pic) => (
                        <li key={pic.id} className="px-3 py-2 rounded-2xl bg-white border border-purple-100 text-center">{pic.author}</li>
                    ))}
                </ul>
            </div>

            <div className="overflow-x-auto scrollbar-hide py-4">
                <div className="flex gap-4">
                    {populate.map((element) => (
                        <div
                            key={element.id}
                            className="flex-shrink-0 bg-white rounded-md overflow-hidden border border-purple-100 shadow-sm w-60"
                        >
                            <img
                                src={element.download_url}
                                alt={element.author}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-3">
                                <h4 className="text-sm font-medium text-purple-800">{element.author}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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
            // Cherche l'input dans le SearchBox
            const input = containerRef.current.querySelector<HTMLInputElement>("input");
            if (input) input.focus();
        }
    }, [isOpen]);
    if (!isOpen) return null;

    return (
        <div
            className={` max-w-4xl mx-auto mt-4 overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[1000px] opacity-100 w-full" : "max-h-0 opacity-0"
                }`}
            ref={containerRef}
        >
            <div className="bg-white  rounded-lg shadow-lg  border-purple-300 space-y-4">
                {/* SearchBox à l’intérieur */}
                <SearchBox
                    classNames={{
                        root: "w-full",
                        form: "relative flex items-center border-2 border-purple-300 rounded-full overflow-hidden shadow-md focus-within:ring-4 focus-within:ring-purple-300 transition-all duration-300",
                        input: "flex-grow px-4 py-3 pr-14 outline-none text-gray-700 placeholder-gray-400 focus:outline-none",
                        submit: "absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200 rounded-full",
                        reset: "absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150",
                    }}

                    placeholder="Rechercher des images..."
                />

                {/* Contenu selon saisie */}
                {query ? (
                    <>
                       <div>
                        <h3 className="font-semibold text-purple-700">
                            Résultats pour : "{query}"
                        </h3>
                        <Hits
                            hitComponent={({ hit }: HitProps) => (
                                <div className="px-3 py-2 bg-purple-50 rounded-md border border-purple-100">
                                    {highlightQuery(hit.author, query)}
                                </div>
                            )}
                            classNames={{
                                list: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                            }}
                        />
                        {componentsResults()}
                   </div>  </>
                ) : (
                    <Default />
                )}
            </div>
        </div>
    );
};


const Default = () => {
    const [picturesRecents, setPicturesRecents] = useState<typeof recents>([]);
    const [picturesPopulate, setPicturesPopulate] = useState<typeof populate>([]);
    const [picturesMoments, setPicturesMoments] = useState<typeof populate>([]);
    const responseMoment = async () => {
        try {
            const response = await api.get('/list');
            console.log("moment pictures:", response.data);
            setPicturesMoments(response.data);
            localStorage.setItem("pictureMoment_cach", JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching moment pictures:", error);
            // return [];
        }
    }


    useEffect(() => {
        const recentCache = localStorage.getItem("pictureRecents_cach");
        const populatCache = localStorage.getItem("picturePopulate_cach");
        const momentCache = localStorage.getItem("pictureMoment_cach");
        console.log("Caches:", { recentCache, populatCache, momentCache });
        //
        if (recentCache) {
            setPicturesRecents(JSON.parse(recentCache));
        } else {
            localStorage.setItem("pictureRecents_cach", JSON.stringify(recents));
            setPicturesRecents(recents);
        }
        //
        if (populatCache) {
            setPicturesPopulate(JSON.parse(populatCache));
        } else {
            localStorage.setItem("picturePopulate_cach", JSON.stringify(populate));
            setPicturesPopulate(populate);
        }

        if (momentCache) {
            setPicturesMoments(JSON.parse(momentCache));
        } else {
            responseMoment()
        }
    }, []);

    const removeRecentSearch = (id: number) => {
        const updatedPictures = picturesRecents.filter(pic => pic.id !== id);
        setPicturesRecents(updatedPictures);
        localStorage.setItem("pictureRencents_cach", JSON.stringify(updatedPictures));
    }
    return (
        <div className="bg-white min-h-[320px] w-full max-w-4xl mx-auto  rounded-xl grid py-4 ">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full grid grid-cols-1 md:grid-cols-2">

                {/* Left column: lists + Top ventes */}
                <div className="flex-1 space-y-6">

                    {/* Mes recherches récentes */}
                    <div className="bg-white">
                        <h3 className="text-lg font-semibold text-purple-800 mb-3">Mes recherches récentes</h3>
                        <ul className="space-y-2">
                            {picturesRecents.map((pic) => (
                                <li key={pic.id} className="hover:bg-purple-50 hover:rounded-md  hover:border-purple-100 px-2 py-1">{pic.author}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Top ventes - carousel */}
                    <div>
                        <h3 className="sm:hidden text-lg font-semibold text-purple-800 mb-3">Top ventes</h3>

                        {/* Carousel horizontal pour mobile */}
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

                        {/* Grid normale pour desktop */}
                    </div>

                    {/* Recherches populaires */}
                    <div>
                        <h3 className="text-lg font-semibold text-purple-800 mb-3">Recherches populaires</h3>
                        <ul className="grid grid-cols-2 gap-5">
                            {picturesPopulate.map((pic) => (
                                <li key={pic.id} className="px-3 py-2 rounded-2xl bg-white border border-purple-100 text-center">{pic.author}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Marques du moment */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-purple-800 mb-3">Marques du moment</h3>
                        <ul className="space-y-2 grid grid-cols-3 gap-5">
                            {picturesPopulate?.map((pic) => (
                                <li key={pic.id} className="px-3 rounded-2xl bg-white border border-purple-100">{pic.author}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right column: Top ventes desktop */}
                <div className="hidden sm:flex sm:flex-col flex-1">
                    <InstantSearch indexName="images" searchClient={typesenseInstantSearchAdapter.searchClient}>
                        <h3 className="text-lg font-semibold text-purple-800 mb-3">Top ventes</h3>
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
            </div>
        </div>


    )
}

export default function Racine() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // close the expanded panel when clicking outside the search area
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
            <div ref={containerRef} className=" max-w-4xl mx-auto px-6 bg-white rounded-xl shadow-md  border-purple-200 shadow-lg backdrop-blur-sm">
                <InstantSearch indexName="images" searchClient={typesenseInstantSearchAdapter.searchClient}>
                    <Configure hitsPerPage={6} />

                    {/* SearchBox initiale visible toujours */}
                    {!isOpen && <SearchInput />}

                    {/* Bloc qui se déploie au clic */}
                    <SearchResultsBlock />
                </InstantSearch>
            </div>
            
        </SearchUIContext.Provider>
    );
}

