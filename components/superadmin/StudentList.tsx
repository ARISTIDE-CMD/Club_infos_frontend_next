import React, { useState } from "react";
import api from "@/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SkeletonAdmin from "../admin/SkeletonAdmin";
// import SkeletonAdmin from "./SkeletonAdmin";
// import './Dash.css'

interface User { id: number; name: string; email: string; role: string; }
interface Evaluation { id: number; grade: string; comment: string; }
interface Submission { id: number; file_path: string; evaluation?: Evaluation; }
interface Project { id: number; title: string; type: string; submission?: Submission | null; }
interface Student {
  filter(arg0: (s: Student) => void): Student[]; id: number; first_name: string; last_name: string; student_id: string; class_group: string; user: User; teacher_name?: string | null; projects: Project[]; created_at: string; 
}

interface StudentListProps {students:Student[],setStudents:React.Dispatch<React.SetStateAction<Student[]>>,loading:boolean,setLoading:React.Dispatch<React.SetStateAction<boolean>>}

const StudentList: React.FC<StudentListProps> = ({students,loading}) => {
    // const [students, setStudents] = useState<Student[]>([]);
    // const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [download,setDownload]=useState<boolean>(false)

    // useEffect(() => {
    //     fetchStudents();
    // }, []);

    const filteredStudents = students.filter((s) => {
        const matchQuery =
            `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.class_group.toLowerCase().includes(searchQuery.toLowerCase());

        const matchDate = (!startDate || new Date(s.created_at) >= startDate) &&
                          (!endDate || new Date(s.created_at) <= endDate);

        return matchQuery && matchDate;
    });

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Liste des étudiants", 14, 20);

        const tableData = filteredStudents.map(s => [
            `${s.first_name} ${s.last_name}`,
            s.student_id,
            s.class_group,
            s.teacher_name || "-",
            s.projects.length
        ]);

        autoTable(doc, {
            startY: 30,
            head: [["Nom", "Matricule", "Classe", "Enseignant", "Projets"]],
            body: tableData,
            styles: { fontSize: 10, cellPadding: 3 },
        });

        doc.save("liste_etudiants.pdf");
    };

     const handleDownload = async (filePath: string) => {
            setDownload(true)
            try {
                const token = localStorage.getItem('authToken');
    
                const response = await api.get(`/download/${encodeURIComponent(filePath)}`, {
                    headers: { Authorization: `Bearer ${token}` }, // si tu veux sécuriser l’accès
                    responseType: 'blob',
                });
    
                const filename = filePath.split('/').pop() || 'fichier.pdf';
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename); // ou le nom que tu veux donner au fichier
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Erreur de téléchargement:', error);
            } finally {
                setDownload(false)
            }
        };

    return (
        <>
            {!loading ?(
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
                        {/* Barre de recherche */}
                        <div className="relative flex-1">
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input
                                type="text"
                                placeholder="Rechercher un étudiant par nom, matricule ou classe..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 text-base shadow-sm"
                            />
                        </div>

                        {/* Filtre par date */}
                        <div className="flex gap-2 items-center">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date?date:undefined)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Date début"
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="Date fin"
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
                            />
                        </div>

                        {/* Bouton Export PDF */}
                        <button
                            onClick={handleExportPDF}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition font-semibold"
                        >
                            Exporter PDF
                        </button>
                    </div>

                    {/* Tableau */}
                    <div className="bg-white shadow-lg rounded-xl overflow-x-hidden border border-gray-100 transition-shadow duration-300">
                        <div className="p-6 bg-green-50/50 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2c0-.523-.197-1.037-.563-1.424M17 20a2 2 0 01-2-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 01-2 2h4l-2 2h8m-9.172-2.172a1 1 0 010-1.414m2.828 0a1 1 0 010 1.414m2.828 0a1 1 0 010 1.414M7 11A6 6 0 1019 11A6 6 0 007 11z"></path></svg>
                                Gestion des étudiants
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Liste complète des étudiants inscrits et leurs informations clés.</p>
                        </div>

                        <div className="overflow-x-hidden">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3.5 px-6 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">Nom</th>
                                        <th className="py-3.5 px-6 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">Matricule</th>
                                        <th className="py-3.5 px-6 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">Classe</th>
                                        <th className="py-3.5 px-6 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">Enseignant</th>
                                        <th className="py-3.5 px-6 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">Projets</th>
                                        <th className="py-3.5 px-6 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((s:Student) => (
                                            <tr key={s.id} className="hover:bg-green-50/20 transition-colors duration-200 group">
                                                <td className="py-4 px-6 font-medium text-gray-800">{s.first_name} {s.last_name}</td>
                                                <td className="py-4 px-6 text-gray-700">{s.student_id}</td>
                                                <td className="py-4 px-6 text-gray-700"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{s.class_group}</span> </td>
                                                <td className="py-4 px-6 text-gray-700 ">Mr/Mme. {s.teacher_name || "-"}</td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.projects.length > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"}`}>
                                                        {s.projects.length} projet(s)
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <button
                                                        onClick={() => setSelectedStudent(s)}
                                                        className="p-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors duration-200 shadow-sm"
                                                    >
                                                        Voir plus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-16 text-center text-gray-400">
                                                Aucun étudiant trouvé.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modal stylisé */}
                  {selectedStudent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scaleIn">
      
      {/* --- Header --- */}
      <div className="relative bg-blue-800 from-slate-900 to-slate-700 px-6 py-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {selectedStudent.first_name} {selectedStudent.last_name}
            </h3>
            <p className="text-slate-300 text-sm">Étudiant • {selectedStudent.class_group}</p>
          </div>
          <button
            onClick={() => setSelectedStudent(null)}
            className="text-slate-300 hover:text-white text-2xl font-light transition-all duration-200 hover:scale-110 p-1"
          >
            ✕
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      </div>

      {/* --- Contenu --- */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
        {/* Informations principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-sm">📧</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Email</p>
              <p className="text-slate-900 font-medium">{selectedStudent.user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-sm">🏫</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Classe</p>
              <p className="text-slate-900 font-medium">{selectedStudent.class_group}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 text-sm">👨‍🏫</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Enseignant</p>
              <p className="text-slate-900 font-medium">{selectedStudent.teacher_name || "Non défini"}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 text-sm">🆔</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">ID Étudiant</p>
              <p className="text-slate-900 font-medium">{selectedStudent.id}</p>
            </div>
          </div>
        </div>

        {/* Section des projets */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-900">Projets associés</h4>
            <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full font-medium">
              {selectedStudent.projects.length}
            </span>
          </div>

          {selectedStudent.projects.length > 0 ? (
            <div className="space-y-3">
              {selectedStudent.projects.map((p) => (
                <div key={p.id} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${
                          p.submission ? 'bg-green-500' : 'bg-slate-300'
                        }`}></div>
                        <div>
                          <p className="font-semibold text-slate-900">{p.title}</p>
                          <p className="text-sm text-slate-500 mt-1">{p.type}</p>
                        </div>
                      </div>
                      
                      {p.submission?.evaluation && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <span className="text-slate-600">Note :</span>
                              <span className="font-semibold text-slate-900">{p.submission.evaluation.grade}</span>
                            </div>
                            <div className="flex-1">
                              <span className="text-slate-600">Commentaire : </span>
                              <span className="text-slate-900">{p.submission.evaluation.comment}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 lg:mt-0 lg:ml-4">
                      {p.submission ? (
                        <button
                          onClick={() => handleDownload(p.submission?.file_path?p.submission.file_path:"")}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          <span>{download?"Téléchargment...":"Télécharger"}</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-sm">
                          Non soumis
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p className="text-slate-500 font-medium">Aucun projet associé</p>
              <p className="text-slate-400 text-sm mt-1">Cet étudiant n&aops;a pas de projets assignés</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Footer --- */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex justify-end">
          <button
            onClick={() => setSelectedStudent(null)}
            className="px-6 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium shadow-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
)}
                </div>
            ):(<SkeletonAdmin premier="NOM" deuxieme="MATRICULE" troisieme="CLASSE" quatrieme="ENSEIGNANT" cinquieme="PROJETS"/>)}
        </>
    );
};

export default StudentList;
