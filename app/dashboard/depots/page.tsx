'use client';

import { useState, useRef, useEffect } from "react";
import { InstantSearch, Hits, SearchBox, useInstantSearch } from "react-instantsearch";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

/* ---------------- TYPESENSE ADAPTER ---------------- */
const typesenseInstantSearchAdapter = new TypesenseInstantsearchAdapter({
    server: {
        apiKey: "xyz",
        nodes: [
            {
                protocol: "http",
                host: "localhost",
                port: 8108,
            },
        ],
    },
    additionalSearchParameters: {
        query_by: "last_name,student_id",
    },
});

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
            <mark className="bg-yellow-300 text-purple-900 font-bold px-1 rounded">{match}</mark>
            {after}
        </>
    );
};

/* ------------------- DROPDOWN RESULT ITEM ------------------- */
const ContactItem = ({ hit }: any) => {
    const router = useRouter();
    const goToStudent = () => router.push(`logStudent/${hit.id}`);

    const { indexUiState } = useInstantSearch();
    const query = indexUiState.query as string;

    return (
        <div
            onClick={goToStudent}
            className="p-4 bg-white rounded-lg hover:shadow-xl hover:bg-purple-50 transition-all cursor-pointer  border-purple-100"
        >
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow">
                    <User className="w-6 h-6 text-purple-900" />
                </div>
                <div>
                    <p className="text-lg font-bold text-purple-900">
                        {highlightMatch(hit.last_name, query)}
                    </p>
                    <p className="text-sm text-purple-600">ID: {highlightMatch(hit.student_id, query)}</p>
                </div>
            </div>
        </div>
    );
};

/* ------------------- DROPDOWN COMPONENT ------------------- */
const DropdownResults = () => {
    const { indexUiState } = useInstantSearch();
    const query = indexUiState.query || "";

    if (!query) return null;

    return (
        <div className="absolute z-50 mt-3 w-full bg-white rounded-xl shadow-xl border border-purple-200 p-4 max-h-96 overflow-auto animate-fadeIn">
            <Hits hitComponent={ContactItem} />
        </div>
    );
};

/* ------------------- MAIN SEARCH COMPONENT ------------------- */
export default function ContactSearch() {
    const [open, setOpen] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-100 py-10 px-5">
            <div className="max-w-4xl mx-auto">
                <InstantSearch
                    indexName="students"
                    searchClient={typesenseInstantSearchAdapter.searchClient}
                >
                    <div ref={boxRef} className="relative max-w-3xl mx-auto mb-10">
                        {/* SearchBox */}
                        <SearchBox
                            onFocus={() => setOpen(true)}
                            placeholder="Rechercher un contact..."
                            classNames={{
                                root: "relative",
                                form: "relative flex items-center",
                                input:
                                    "w-full pl-14 pr-14 py-5 text-lg text-purple-900 placeholder-purple-400 font-medium rounded-2xl shadow-2xl border-2 border-purple-200 focus:outline-none",
                            }}
                        />

                        {/* Animated dropdown */}
                        {open && <DropdownResults />}
                    </div>
                </InstantSearch>
            </div>
        </div>
    );
}
