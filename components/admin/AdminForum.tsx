'use client'
import { useState, useMemo } from "react";
import api from "../../api"; // instance axios
// import SkeletonChat from "./SkeletonChat";
import SkeletonChat from "./SkeletonChat";

interface Message {
  project_id: number;
  project_name:string
  message: string;
  user_name: string;
  user_role: string;
  created_at: string;
}

interface Student {
  student_id: number;
  user_name: string;
  project_id: number;
}

interface AdminChatData {
  messages: Message[];
  students: Student[];
}
// interface TypeProps{
//   valeur:boolean
// }

export default function AdminForum() {
  const [chatData, setChatData] = useState<AdminChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForums, setOpenForums] = useState<{ [key: number]: boolean }>({});
  const [chatInput, setChatInput] = useState<{ [key: number]: string }>({});
  const [loadingSend, setLoadingSend] = useState(false);

  // ✅ Récupérer tous les messages


  const fetchAllMessages = async () => {
    // setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const res = await api.get("/admin/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatData(res.data);
      console.log("Données du chat admin :", res.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors du chargement des messages.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction pour envoyer un message par l'admin
  const handleSendMessage = async (projectId: number) => {
    if (!chatInput[projectId]) return;

    setLoadingSend(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await api.post(
        "/projects/messages",
        {
          project_id: projectId,
          message: chatInput[projectId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Mettre à jour le chat localement
      setChatData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, res.data],
        };
      });

      setChatInput(prev => ({ ...prev, [projectId]: "" }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erreur lors de l'envoi du message", err);
    } finally {
      setLoadingSend(false);
      fetchAllMessages()
    }
  };

  // if(valeur==true) fetchAllMessages()

  useMemo(() => {
    fetchAllMessages();
  }, []);

  if (loading) return <SkeletonChat />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!chatData) return null;

  // Grouper les messages par projet
  const messagesByProject = chatData.messages.reduce(
  (acc: Record<number, Message[]>, msg: Message) => {
    if (!acc[msg.project_id]) acc[msg.project_id] = [];
    acc[msg.project_id].push(msg);
    return acc;
  },
  {} as Record<number, Message[]>
);


  return (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
  {Object.entries(messagesByProject).map(([projectId, messages]) => {
    const numericId = Number(projectId);

    const projectStudents = chatData.students.filter(
      s => s.project_id === numericId
    );

    const memberCount = projectStudents.length + 1;
    const projectName =
      (messages as Message[])[0]?.project_name || `Projet #${projectId}`;

    // ✅ On lit l’état depuis openForums
    const isOpen = openForums[numericId] || false;

    return (
      <div
        key={projectId}
        className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 h-auto transition-all duration-300"
      >
        {/* --- En-tête du chat --- */}
        <div
          className="flex justify-between items-center cursor-pointer select-none"
          onClick={() =>
            setOpenForums(prev => ({
              ...prev,
              [numericId]: !prev[numericId], // ✅ chaque projet est indépendant
            }))
          }
        >
          <div>
            <h3 className="text-lg text-gray-900 font-bold mb-1">💬 {projectName}</h3>
            <p className="text-sm text-gray-500">
              👥 {memberCount} membre{memberCount > 1 ? 's' : ''}
            </p>
          </div>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 50,
              backgroundColor: isOpen ? 'green' : 'gray',
              opacity: 0.6,
            }}
          ></div>
        </div>

        {/* --- Contenu repliable --- */}
        {isOpen && (
          <>
            {/* Membres du projet */}
            {projectStudents.length > 0 && (
              <div className="mt-3 mb-3 border border-gray-200 bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  👥 Membres du projet :
                </h4>
                <ul className="text-sm text-gray-600 flex flex-wrap gap-2">
                  {projectStudents.map((student, i) => (
                    <li
                      key={i}
                      className="bg-gray-200 px-2 py-1 rounded-full text-xs font-medium text-gray-800"
                    >
                      {student.user_name}
                    </li>
                  ))}
                  <li className="bg-indigo-100 px-2 py-1 rounded-full text-xs font-medium text-indigo-800">
                    Admin
                  </li>
                </ul>
              </div>
            )}

            {/* Messages */}
            <div className="max-h-60 overflow-y-auto border p-3 rounded-lg bg-gray-50 mb-3 space-y-2">
              {(messages as Message[]).map((msg, idx) => {
                const isAdmin = msg.user_role === 'admin';
                return (
                  <div key={idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] p-2 rounded-lg shadow-sm ${
                        isAdmin
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      {!isAdmin && (
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                          {msg.user_name}
                        </div>
                      )}
                      <div className="text-sm">{msg.message}</div>
                      <div
                        className={`text-[10px] mt-1 ${
                          isAdmin ? 'text-indigo-200 text-right' : 'text-gray-500 text-left'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input pour envoyer un message */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Écrire un message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={chatInput[numericId] || ''}
                onChange={e =>
                  setChatInput(prev => ({ ...prev, [numericId]: e.target.value }))
                }
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                onClick={() => handleSendMessage(numericId)}
                disabled={loadingSend}
                style={{ opacity: loadingSend ? 0.5 : 1 }}
              >
                {loadingSend ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </>
        )}
      </div>
    );
  })}
</div>


  );
}
