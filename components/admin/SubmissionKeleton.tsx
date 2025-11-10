import React from 'react';

const SubmissionItemSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse space-y-4">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-2/5"></div> {/* Titre */}
                        <div className="h-4 bg-gray-200 rounded w-4/5 mt-2"></div> {/* Description */}
                    </div>
                    <div className="h-6 w-12 bg-gray-300 rounded-full"></div> {/* Note */}
                </div>

                <div className="mt-4 ml-7 flex flex-wrap items-center justify-between gap-4 text-sm border-t border-gray-100 pt-3">
                    <div className='flex flex-wrap gap-x-6 gap-y-2'>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-8 w-28 bg-gray-300 rounded-lg"></div> {/* Bouton Archiver */}
                </div>
            </div>

            {/* Contenu détaillé */}
            <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="h-16 bg-gray-100 rounded-xl"></div>
                    <div className="h-16 bg-gray-100 rounded-xl"></div>
                    <div className="h-16 bg-gray-100 rounded-xl"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-100 rounded-xl"></div>
                    <div className="h-20 bg-gray-100 rounded-xl"></div>
                </div>

                <div className="h-24 bg-gray-100 rounded-xl"></div> {/* Équipe projet */}

                <div className="h-32 bg-gray-100 rounded-xl"></div> {/* Formulaire d'évaluation */}
            </div>
        </div>
    );
};

export default SubmissionItemSkeleton;
