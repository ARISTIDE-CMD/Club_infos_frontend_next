'use client';

import { InstantSearch, Hits, Pagination, useInstantSearch, SearchBox } from "react-instantsearch";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { User, Phone } from "lucide-react";

type ContactProps = {
    hit: {
        last_name: string,
        student_id: number
    }
}

const typesenseInstantSearchAdapter = new TypesenseInstantsearchAdapter({
    server: {
        apiKey: 'xyz',
        nodes: [
            {
                protocol: 'http',
                host: 'localhost',
                port: 8108
            }
        ]
    },
    additionalSearchParameters: {
        query_by: 'last_name, student_id'
    }
})

const highlightMatch = (text: string | number, query: string) => {
    if (!query) return text;

    const textStr = text.toString();
    const lowerText = textStr.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return textStr;

    const before = textStr.slice(0, index);
    const match = textStr.slice(index, index + query.length);
    const after = textStr.slice(index + query.length);

    return (
        <>
            {before}
            <mark className="bg-yellow-300 text-purple-900 font-bold px-1.5 py-0.5 rounded">{match}</mark>
            {after}
        </>
    );
};


const ContactList = ({ hit }: { hit: ContactProps['hit'] }) => {
    const { indexUiState } = useInstantSearch();
    const query = indexUiState.query as string;
    if (!query) return null;

    return (
        <div className="bg-white rounded-xl hover:shadow-2xl transition-all duration-500 border-2 border-purple-100 hover:border-yellow-400 overflow-hidden group animate-fade-in-up cursor-pointer hover:-translate-y-1">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 transition-all duration-300 group-hover:from-purple-700 group-hover:to-purple-800">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <User className="w-6 h-6 text-purple-900" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-bold text-lg transition-all duration-300 group-hover:translate-x-1">
                            {highlightMatch(hit.last_name, query)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-white to-purple-50 transition-all duration-300 group-hover:from-purple-50 group-hover:to-purple-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                        <Phone className="w-5 h-5 text-purple-900" strokeWidth={2.5} />
                    </div>
                    <div className="transition-all duration-300 group-hover:translate-x-1">
                        <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">numéro</p>
                        <p className="text-purple-900 font-bold text-lg">
                            {highlightMatch(hit.student_id, query)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const input = `
        w-full 
        pl-14 pr-14 py-4
        text-lg text-purple-900 
        placeholder-purple-400 
        font-medium
        focus:outline-none 
        focus:ring-2 focus:ring-purple-300 
        rounded-xl
        transition-all duration-200
    `

const submit = `
        absolute right-4 top-1/2 
        -translate-y-1/2 
        text-purple-600 
        hover:text-purple-800 
        transition-colors
    `

const reset = `
        absolute right-14 top-1/2 
        -translate-y-1/2 
        bg-purple-100 
        hover:bg-purple-200 
        rounded-full 
        p-2 
        transition-all
        shadow-sm
    `


const link = `
        px-5 py-3 rounded-xl font-semibold
        text-purple-700
        transition-all duration-300
        border-2 border-transparent
        hover:bg-yellow-400 hover:text-purple-900 hover:border-purple-600
        shadow-sm hover:shadow-md
    `

const selectedItem = `
        bg-yellow-400
        text-purple-900
        border-purple-600
        shadow-md 
        scale-105
    `

const animation = `
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
                
                .animate-fade-in-up:nth-child(1) { animation-delay: 0.05s; }
                .animate-fade-in-up:nth-child(2) { animation-delay: 0.1s; }
                .animate-fade-in-up:nth-child(3) { animation-delay: 0.15s; }
                .animate-fade-in-up:nth-child(4) { animation-delay: 0.2s; }
                .animate-fade-in-up:nth-child(5) { animation-delay: 0.25s; }
                .animate-fade-in-up:nth-child(6) { animation-delay: 0.3s; }
                .animate-fade-in-up:nth-child(7) { animation-delay: 0.35s; }
                .animate-fade-in-up:nth-child(8) { animation-delay: 0.4s; }
            `
export default function ContactSearch() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
            <style>{animation}</style>
            <div className="max-w-5xl mx-auto">
                <InstantSearch indexName="students" searchClient={typesenseInstantSearchAdapter.searchClient}>
                    {/* Search Box */}
                    <div className="mb-8">
                        <div className="relative max-w-3xl mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-yellow-400 rounded-2xl blur opacity-20"></div>
                            <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden">
                                <SearchBox
                                    placeholder="Rechercher un contact..."


                                    classNames={{
                                        root: "relative",
                                        form: `
        relative flex items-center 
        w-full
    `,
                                        input: `${input} `,
                                        submit: `${submit}`,
                                        reset: `${reset}`,
                                        submitIcon: "w-6 h-6",

                                    }}

                                />
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-yellow-400 to-purple-600"></div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <Hits
                            hitComponent={ContactList}
                            classNames={{
                                root: 'col-span-full',
                                list: 'grid grid-cols-1 md:grid-cols-2 gap-6',
                                item: ''
                            }}
                        />
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center">
                        <div className="bg-white rounded-xl shadow-lg border-2 border-purple-200 p-2">
                            <Pagination
                                classNames={{
                                    root: "flex justify-center",
                                    list: "flex items-center gap-3",
                                    item: "inline-block",
                                    link: `${link}`,
                                    selectedItem: `${selectedItem}`,
                                    disabledItem: `
        opacity-40 cursor-not-allowed grayscale
    `,
                                }}

                            />
                        </div>
                    </div>
                </InstantSearch>
            </div>
        </div>
    )
}

