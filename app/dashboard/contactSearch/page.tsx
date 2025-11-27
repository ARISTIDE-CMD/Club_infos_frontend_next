'use client'
import { InstantSearch, Hits, Pagination, useInstantSearch, SearchBox } from "react-instantsearch";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { User, Phone, Search } from "lucide-react";
import { useRouter } from "next/navigation";

type ContactProps = {
    hit: {
        last_name: string,
        student_id: number,
        id:number
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

    const navigate=useRouter();

    const goToStudent = () => {
    navigate.push(`logStudent/${hit.id}`);
  };
    console.log(hit);
    const { indexUiState } = useInstantSearch();
    const query = indexUiState.query as string;
    if (!query) return null;
    
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-yellow-400 overflow-hidden group"
            onClick={goToStudent}
        >
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <User className="w-6 h-6 text-purple-900" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-bold text-lg">
                            {highlightMatch(hit.last_name, query)}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-white to-purple-50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shadow-md">
                        <Phone className="w-5 h-5 text-purple-900" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">ID Étudiant</p>
                        <p className="text-purple-900 font-bold text-lg">
                            {highlightMatch(hit.student_id, query)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ContactSearch() {


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-block mb-4">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 rounded-full shadow-lg">
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                CARNET DE CONTACTS
                            </h1>
                        </div>
                    </div>
                    <p className="text-purple-700 text-lg font-medium">
                        Trouvez vos contacts rapidement et facilement
                    </p>
                </div>
                
                <InstantSearch indexName="students" searchClient={typesenseInstantSearchAdapter.searchClient}>
                    {/* Search Box */}
                    <div className="mb-8">
                        <div className="relative max-w-3xl mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-yellow-400 rounded-2xl blur opacity-20"></div>
                            <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden">
                                <SearchBox 
                                    placeholder="Rechercher un contact..."
                                    classNames={{
                                        root: 'relative',
                                        form: 'relative flex items-center',
                                        input: 'w-full pl-14 pr-14 py-5 text-lg text-purple-900 placeholder-purple-400 focus:outline-none font-medium',
                                        submit: 'absolute left-4 top-1/2 transform -translate-y-1/2',
                                        reset: 'absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-100 hover:bg-purple-200 rounded-full p-2 transition-colors',
                                        submitIcon: 'w-6 h-6 text-purple-600',
                                        resetIcon: 'w-4 h-4 text-purple-600'
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
                                    root: 'flex justify-center',
                                    list: 'flex items-center space-x-2',
                                    item: 'inline-block',
                                    link: 'px-5 py-3 rounded-lg font-bold text-purple-700 hover:bg-yellow-400 hover:text-purple-900 transition-all duration-200 border-2 border-transparent hover:border-purple-600',
                                    selectedItem: 'opcacity-100 rounded-lg bg-yellow-400 text-purple-900 border-2 border-purple-600',
                                    disabledItem: 'opacity-40 cursor-not-allowed'
                                }}
                            />
                        </div>
                    </div>
                </InstantSearch>
                
                {/* Footer Badge */}
                <div className="text-center mt-12">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-full shadow-lg">
                        <Search className="w-5 h-5 text-yellow-400" />
                        <span className="font-bold">Propulsé par Typesense</span>
                    </div>
                </div>
            </div>
        </div>
    )
}