import React from "react";

const SkeletonChat: React.FC = () => {
  return (
    <div className=" animate-pulse grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((skeletonId) => (
        <div
          key={skeletonId}
          className="bg-white rounded-xl shadow-lg p-5 border border-gray-200"
        >
          {/* --- En-tête --- */}
          <div className="flex justify-between items-center mb-3">
            <div className="h-5 bg-gray-300 rounded w-1/3"></div>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 50,
                backgroundColor: "gray",
                opacity: 0.3,
              }}
            ></div>
          </div>

          {/* --- Membres --- */}
          <div className="mb-3 border border-gray-200 bg-gray-50 p-3 rounded-lg">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-300 h-5 w-20 rounded-full"
                ></div>
              ))}
            </div>
          </div>

          {/* --- Messages --- */}
          <div className="max-h-60 overflow-y-auto border p-3 rounded-lg bg-gray-50 mb-3 space-y-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[75%] p-2 rounded-lg shadow-sm ${
                    i % 2 === 0
                      ? "bg-gray-300 rounded-bl-none"
                      : "bg-gray-300 rounded-br-none"
                  }`}
                >
                  <div className="h-3 bg-gray-400 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-400 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-400 rounded w-1/4 mt-1"></div>
                </div>
              </div>
            ))}
          </div>

          {/* --- Champ d’envoi --- */}
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
            <div className="h-10 w-20 bg-gray-400 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonChat;
