import React from "react";

interface SkeletonAdminProps {
  premier: string;
  deuxieme: string;
  troisieme: string;
  quatrieme: string;
  cinquieme:string
  // cinquieme: string;
}

const SkeletonAdmin: React.FC<SkeletonAdminProps> = ({premier, deuxieme, troisieme, quatrieme, cinquieme}) => {
  // Créons un tableau temporaire pour simuler plusieurs lignes
  const rows = Array(6).fill(0);

  return (
    <div className="animate-pulse">
      {/* BARRE DE RECHERCHE SIMULÉE */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-300 rounded-full" />
          <div className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-lg bg-gray-100" />
        </div>
      </div>

      {/* CONTAINER DU TABLEAU */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        {/* EN-TÊTE */}
        <div className="p-6 bg-green-50/50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-200 rounded-full" />
            <div className="h-5 w-48 bg-gray-200 rounded-md" />
          </div>
          <div className="mt-2 h-3 w-64 bg-gray-100 rounded-md" />
        </div>

        {/* TÊTE DU TABLEAU */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="w-1/5">{premier}</div>
            <div className="w-1/5">{deuxieme}</div>
            <div className="w-1/5">{troisieme}</div>
            <div className="w-1/5">{quatrieme}</div>
            <div className="w-1/5" style={{display:cinquieme? "block":"none"}}>{cinquieme}</div>
            {/* <div className="w-1/5">{cinquieme}</div> */}
            <div className="w-1/5 text-center">ACTIONS</div>
          </div>
        </div>

        {/* LIGNES DE TABLEAU SIMULÉES */}
        <div>
          {rows.map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-4 border-b border-gray-100"
            >
              <div className="w-1/5 h-4 bg-gray-200 rounded-md" />
              <div className="w-1/5 h-4 bg-gray-200 rounded-md" />
              <div className="w-1/5 h-4 bg-gray-200 rounded-md" />
              <div className="w-1/5 h-4 bg-gray-200 rounded-md" />
              <div className="w-1/5 flex justify-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-lg" />
                <div className="w-8 h-8 bg-gray-300 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* PIED DE PAGE */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="h-3 w-40 bg-gray-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonAdmin;
