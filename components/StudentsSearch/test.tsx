/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";
import api from "@/api";
import { useAuthStore } from "@/store";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from "next/navigation";
// import './Dash.css'
// import EvaluationForm from "./SubmissionForm";
import EvaluationForm from "@/components/admin/EvaluationForm";
// import AdminForum from "./AdminForum";
import AdminForum from "@/components/admin/AdminForum";
// import MeritChart from "./Performance";
import MeritChart from "@/components/admin/Performance";
// import SkeletonAdmin from "./SkeletonAdmin";
import SkeletonAdmin from "@/components/admin/SkeletonAdmin";
// import SubmissionItemSkeleton from "./SubmissionItemSkeleton";
import SubmissionItemSkeleton from "@/components/admin/SubmissionKeleton";
import './module.css'

interface Student {
  id: number;
  student_id: string;
  class_group: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
type stude = {
  id: number;
  last_name: string;
  first_name: string
}

interface Project {
  id: number;
  title: string;
  description: string;
  students: Student[];
  created_at: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
}

// interface Project {
//   title: string;
//   description: string;
//   students?: Student[];
// }

interface Submission {
  id: number;
  file_path: string;
  evaluation?: {
    grade: number
    comment: string
  };
  filename: string;
  created_at: string;
  grade?: number;
  evaluation_comment?: string;
  evaluated_at?: string;
  project?: Project;
  student?: Student;
  archiv: boolean
}

interface SubmissionItemProps {
  submission: Submission;
  projectCreatedAt: Date;
  submissionCreatedAt: Date;
  durationDays: number;
  durationHours: number;
  durationsMinut: number;
  onArchiveToggle: (id: number) => void;
}

export default function StudentsPage() {
  const router = useRouter();
  // const setLoggedOut = useAuthStore((s) => s.setLoggedOut);
  const [students, setStudents] = useState<Student[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [archivedSubmissions, setArchivedSubmissions] = useState<Submission[]>([]);
  // const [archive, setArchive] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [loadingProject, setLoadingProjet] = useState<boolean>(true)
  const [loadingSoumission, setLoadingSoumission] = useState<boolean>(true)
  const [message, setMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateStudentModalOpen, setIsCreateStudentModalOpen] = useState(false)
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [itemTypeToDelete, setItemTypeToDelete] = useState<'student' | 'project' | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [update, setUpdate] = useState<boolean>(false)
  const [submissionToArchive, setSubmissionToArchive] = useState<Submission[]>([]);
  const [isLoadingLogout, setIsloadinLogout] = useState<boolean>(false)
  const [filtered, setFiltered] = useState<Submission[]>([])
  const [grade, setGrade] = useState<number>();
  const [loadindDelete, setLoadingDelete] = useState<boolean>(false)
  const [commentaire, setCommentaire] = useState({
    name: "",
    email: ""
  });

  // const [comment, setComment] = useState<string>(submissions.evaluation?.comment ?? '');
  const [formDataStudent, setFormDataStudent] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    student_id: "",
    class_group: "L1 Info",
  });


  const [formDataProject, setFormDataProject] = useState({
    title: "",
    description: "",
    student_ids: [] as number[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [view, setView] = useState<ViewType>('students');
  const [download, setDownload] = useState<boolean>(false);
  // États pour gérer l'évaluation
  const [evaluations, setEvaluations] = useState({});
  const [evaluationLoading, setEvaluationLoading] = useState(false);


  const handleDeleteStudent = (studentId: number) => {
    setItemToDelete(studentId);
    setItemTypeToDelete('student');
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteStudent = async () => {
    if (itemToDelete === null) return;
    try {
      const token = localStorage.getItem("authToken");
      await api.delete(`/admin/students/${itemToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Étudiant supprimé avec succès.");
      let compt = 0
      const intervall = setInterval(() => {
        compt++;
        if (compt == 2) {
          setMessage('')
          clearInterval(intervall)
        }
      }, 1000)
      setStudents(students.filter((s) => s.id !== itemToDelete));
    } catch (error) {
      console.error("Erreur suppression:", error);
      setMessage("Erreur lors de la suppression.");
      let compt = 0
      const intervall = setInterval(() => {
        compt++;
        if (compt == 2) {
          setMessage('')
          clearInterval(intervall)
        }
      }, 1000)
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setItemTypeToDelete(null);
    }
  };

  const handleEdit = (student: Student) => {
    const [firstName, ...rest] = student.user.name.split(" ");
    const lastName = rest.join(" ");
    setStudentToEdit(student);
    setFormDataStudent({
      ...formDataStudent,
      first_name: firstName,
      last_name: lastName,
      student_id: student.student_id,
      class_group: student.class_group,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdate(true);
    if (!studentToEdit) return;

    try {
      const token = localStorage.getItem("authToken");
      await api.put(`/admin/students/${studentToEdit.id}`, formDataStudent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let compt = 0
      setMessage("✅ Étudiant mis à jour avec succès.");
      setUpdate(false)
      const intervall = setInterval(() => {
        compt++;
        if (compt == 2) {
          setMessage('')
          clearInterval(intervall)
        }
      }, 1000)
      setIsEditModalOpen(false);
      setStudentToEdit(null);
      fetchStudents(); // Recharger la liste des étudiants
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      setMessage("❌ Échec de la mise à jour.");
      let compt = 0
      const intervall = setInterval(() => {
        compt++;
        if (compt == 2) {
          setMessage('')
          clearInterval(intervall)
        }
      }, 1000)
    }
  };

  const confirmDelete = async () => {
    setLoadingDelete(true)
    if (itemTypeToDelete === 'student') {
      await confirmDeleteStudent();
    } else if (itemTypeToDelete === 'project') {
      // await confirmDeleteProject();
    }
    setLoadingDelete(false)
  };
  const fetchStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setMessage("Non autorisé. Veuillez vous connecter.");
        let compt = 0;
        const intervall = setInterval(() => {
          compt++;
          if (compt === 2) {
            setMessage("");
            clearInterval(intervall);
          }
        }, 1000);
        return;
      }

      const response = await api.get("/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
// const reponse = await api.get("/students/index-typesense", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      setStudents(response.data.students);
      console.log("Liste des étudiants ", response.data.students);
      // console.log("Liste des projets ", reponse.data);

    } catch (error) {
      console.error("Erreur lors du chargement des étudiants:", error);
      setMessage("Erreur lors du chargement des étudiants.");
      setStudents([error as unknown as Student]);

      let compt = 0;
      const intervall = setInterval(() => {
        compt++;
        if (compt === 2) {
          setMessage("");
          clearInterval(intervall);
        }
      }, 1000);

    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateStudent = () => {
    setIsCreateStudentModalOpen(true);
  };

  const handleStudentFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      await api.post("/admin/students", formDataStudent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Étudiant ajouté avec succès.");
      let compt = 0
      const intervall = setInterval(() => {
        compt++;
        if (compt == 2) {
          setMessage('')
          clearInterval(intervall)
        }
      }, 1000)

      setIsCreateStudentModalOpen(false);
      fetchStudents(); // Recharger la liste des étudiants
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      // if(error!=="AxiosError: Request failed with status code 422")
      // setMessage("Erreur lors de l'ajout de l'étudiant."+error);
    } finally {
      setIsSubmitting(false);
      setFormDataStudent({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        student_id: "",
        class_group: "L1 Info",
      });
    }
  };

  const handleStudentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormDataStudent({ ...formDataStudent, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);


  if (loading) return (<SkeletonAdmin premier="Nom" deuxieme="Prénom" troisieme="Matricule" quatrieme="Classe" cinquieme="" />)
  const filteredStudents = students.filter(student =>
    student.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class_group?.toLowerCase().includes(searchQuery.toLowerCase())
  );

const ListHit=({ hit }: { hit: any })=> {
    
        return (
                      <tr
                        key={hit.id}
                        // Hover simple et élégant
                        className="hover:bg-green-50/20 transition-colors duration-200 group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-4 px-6 font-medium text-gray-800">
                          {hit.last_name}
                        </td>
                        <td className="py-4 px-6  text-gray-700">
                          {hit.first_name}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">
                            {hit.student_id}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {/* Badge de classe avec couleur et fond coordonnés */}
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {hit.class_group}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center space-x-2">
                            {/* Bouton Modifier : Couleur primaire */}
                            <button
                              onClick={() => handleEdit(hit)}
                              className="p-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors duration-200 shadow-sm flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-6l4 4m-4-4l-9 9m9-9l9 9"></path></svg>
                              {/* Modifier */}
                            </button>

                            {/* Bouton Supprimer : Couleur d'alerte sobre */}
                            <button
                              onClick={() => handleDeleteStudent(hit.id)}
                              className="p-2 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-800 transition-colors duration-200 shadow-sm flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              {/* Supprimer */}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

  return (
    <>
      <div><header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 l-20" style={{ left: 20 }}>
            Tableau de bord Étudiants
          </h1>
          <p className="text-gray-500">
            Gestion des étudiants inscrits
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={handleCreateStudent}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition font-semibold flex items-center gap-2"
          >
            {/* SVG : Utilisateur avec un signe Plus */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Ajouter un étudiant
          </button>
        </div>
      </header>
      {message && (
                    <div
                        className="fixed top-5 right-5 z-50 bg-green-100 border border-green-300 
               text-green-700 font-medium px-4 py-3 rounded-lg shadow-lg 
               animate-slide-in"
                    >
                        {message}
                    </div>
                )}
      </div>
      <div className="mb-8">
        {/* BARRE DE RECHERCHE : Style minimaliste, centrée sur l'icône SVG */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Rechercher un étudiant par nom, matricule ou classe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // Simplification des classes: moins d'ombre, plus de focus clair
            className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 text-base shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflowX-hidden border border-gray-100 transition-shadow duration-300"
        style={{
          overflowX: "hidden"
        }}
      >

        {/* EN-TÊTE : Couleur de fond unie très claire, pas de dégradé prononcé */}
        <div className="p-6 bg-green-50/50 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            {/* Icône SVG professionnelle */}
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2c0-.523-.197-1.037-.563-1.424M17 20a2 2 0 01-2-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 01-2 2h4l-2 2h8m-9.172-2.172a1 1 0 010-1.414m2.828 0a1 1 0 010 1.414m2.828 0a1 1 0 010 1.414M7 11A6 6 0 1019 11A6 6 0 007 11z"></path></svg>
            Gestion des Instituteurs
          </h2>
          <p className="text-gray-500 text-sm mt-1">Liste complète des instite inscrits et leurs informations clés.</p>
        </div>

        {/* CORPS DU TABLEAU */}
        <div className="overflow-x-auto"
          style={{
            overflowX: "hidden"
          }}
        >
          <table className="min-w-full text-sm"
            style={{
              overflowX: "hidden"
            }}
          >

            {/* TÊTE DE TABLEAU : Fond uni pour la clarté */}
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 px-6 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">
                  Nom
                </th>
                <th className="py-3.5 px-6 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">
                  Prénom
                </th>
                <th className="py-3.5 px-6 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">
                  Matricule
                </th>
                <th className="py-3.5 px-6 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">
                  Classe
                </th>
                <th className="py-3.5 px-6 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents
                  // La fonction de tri (sort) semble trier une variable par elle-même (var1 - var2),
                  // j'ai conservé la structure mais je vous conseille de la revoir pour trier par nom (e.g. var1.localeCompare(var2))
                  .sort((a, b) => {
                    const lastNameCompare = a.last_name.localeCompare(b.last_name);
                    if (lastNameCompare !== 0) return lastNameCompare;
                    return a.first_name.localeCompare(b.first_name);
                  })
                  .map((s, index) => {
                    const [firstName, ...lastNameParts] = s.user.name.split(" ");
                    const lastName = lastNameParts.join(" ");
                    return (
                      <tr
                        key={s.id}
                        // Hover simple et élégant
                        className="hover:bg-green-50/20 transition-colors duration-200 group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-4 px-6 font-medium text-gray-800">
                          {lastName}
                        </td>
                        <td className="py-4 px-6  text-gray-700">
                          {firstName}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">
                            {s.student_id}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {/* Badge de classe avec couleur et fond coordonnés */}
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {s.class_group}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center space-x-2">
                            {/* Bouton Modifier : Couleur primaire */}
                            <button
                              onClick={() => handleEdit(s)}
                              className="p-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors duration-200 shadow-sm flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-6l4 4m-4-4l-9 9m9-9l9 9"></path></svg>
                              {/* Modifier */}
                            </button>

                            {/* Bouton Supprimer : Couleur d'alerte sobre */}
                            <button
                              onClick={() => handleDeleteStudent(s.id)}
                              className="p-2 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-800 transition-colors duration-200 shadow-sm flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              {/* Supprimer */}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                      <p className="text-base font-medium mb-1 text-gray-500">Aucun étudiant trouvé</p>
                      <p className="text-gray-400 text-sm">
                        {searchQuery ? "Veuillez vérifier votre recherche." : "Ajoutez un étudiant pour commencer."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PIED DE TABLEAU : Information de décompte claire */}
        {filteredStudents.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 font-medium">
              Total des résultats : <span className="text-green-600 font-bold">{filteredStudents.length}</span> étudiant{filteredStudents.length > 1 ? 's' : ''} affiché{filteredStudents.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
      <Transition appear show={isCreateStudentModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsCreateStudentModalOpen(false)}>
          {/* Backdrop (Assombrissement de l'arrière-plan) */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* Utilisation d'un fond plus opaque et flou pour un effet professionnel */}
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              {/* Contenu de la modale */}
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-8 text-left align-middle shadow-2xl transition-all">

                  {/* En-tête de la modale */}
                  <Dialog.Title as="h3" className="text-2xl font-extrabold leading-tight text-gray-900 mb-2">
                    Créer un nouvel étudiant
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mb-6">
                    Veuillez remplir tous les champs pour enregistrer un nouvel étudiant.
                  </p>

                  <form onSubmit={handleStudentFormSubmit} className="space-y-6">

                    {/* Champs du formulaire */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      {/* Champ: Prénom */}
                      <div>
                        {/* Utilisation de 'htmlFor' pour l'accessibilité */}
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Prénom</label>
                        <input
                          id="first_name"
                          type="text"
                          name="first_name"
                          value={formDataStudent.first_name}
                          onChange={handleStudentFormChange}
                          required
                          placeholder="Ex: Jean"
                          // Classes améliorées: plus de padding, border plus subtile, ombre au focus
                          className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                      </div>

                      {/* Champ: Nom de famille */}
                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Nom de famille</label>
                        <input
                          id="last_name"
                          type="text"
                          name="last_name"
                          value={formDataStudent.last_name}
                          onChange={handleStudentFormChange}
                          required
                          placeholder="Ex: Dupont"
                          className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Champ: Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formDataStudent.email}
                        onChange={handleStudentFormChange}
                        required
                        placeholder="Ex: jean.dupont@ecole.com"
                        className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                      />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      {/* Champ: Mot de passe */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input
                          id="password"
                          type="password"
                          name="password"
                          value={formDataStudent.password}
                          onChange={handleStudentFormChange}
                          required
                          placeholder="Minimum 8 caractères"
                          className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                      </div>

                      {/* Champ: Matricule étudiant */}
                      <div>
                        <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">Matricule étudiant</label>
                        <input
                          id="student_id"
                          type="text"
                          name="student_id"
                          value={formDataStudent.student_id}
                          onChange={handleStudentFormChange}
                          required
                          placeholder="Ex: S2025-4567"
                          className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                      </div>
                    </div>


                    {/* Champ: Classe */}
                    <div>
                      <label htmlFor="class_group" className="block text-sm font-medium text-gray-700">Classe</label>
                      <select
                        id="class_group"
                        name="class_group"
                        value={formDataStudent.class_group}
                        onChange={handleStudentFormChange}
                        required
                        // Utilisation des mêmes classes de style pour l'uniformité
                        className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                      >
                        {/* Ajouter une option par défaut désactivée et non sélectionnable */}
                        <option value="" disabled>Sélectionner une classe</option>
                        <option value="L1 Info">L1 Info</option>
                        <option value="L2 Info">L2 Info</option>
                        <option value="L3 Info">L3 Info</option>
                      </select>
                    </div>

                    {/* Boutons d'action */}
                    <div className="pt-4 flex justify-between space-x-3">

                      {/* Bouton Annuler (Secondaire) */}
                      <button
                        type="button"
                        className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 ease-in-out"
                        onClick={() => setIsCreateStudentModalOpen(false)}
                      >
                        Annuler
                      </button>

                      {/* Bouton Créer (Principal) */}
                      <button
                        type="submit"
                        // Classes de bouton principal améliorées: couleur plus profonde, ombre
                        className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition duration-150 ease-in-out shadow-md ${isSubmitting
                          ? 'bg-indigo-400 cursor-not-allowed' // État de soumission
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' // État normal
                          }`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Création en cours...' : 'Créer l’étudiant'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isEditModalOpen} as={Fragment}>
        {/* Z-index plus élevé pour s'assurer que la modale est au-dessus des autres éléments */}
        <Dialog as="div" className="relative z-50" onClose={() => setIsEditModalOpen(false)}>

          {/* Backdrop (Assombrissement de l'arrière-plan avec flou) */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* Utilisation d'un fond plus opaque et flou pour un effet professionnel */}
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">

              {/* Contenu de la modale */}
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/* Conteneur de la modale : max-w-lg, p-8, rounded-xl, shadow-2xl */}
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-8 text-left align-middle shadow-2xl transition-all">

                  {/* En-tête de la modale */}
                  <Dialog.Title as="h3" className="text-2xl font-extrabold leading-tight text-gray-900 mb-2">
                    Modifier l&apos;étudiant
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mb-6">
                    Mettez à jour les informations de l&apos;étudiant.
                  </p>

                  <form onSubmit={handleUpdateStudent} className="space-y-6">

                    {/* Grille pour les noms */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      {/* Champ: Prénom */}
                      <div>
                        <label htmlFor="edit_first_name" className="block text-sm font-medium text-gray-700">Prénom</label>
                        <input
                          id="edit_first_name"
                          type="text"
                          name="first_name"
                          value={formDataStudent.first_name}
                          onChange={handleStudentFormChange}
                          required
                          className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        />
                      </div>

                      {/* Champ: Nom de famille */}
                      <div>
                        <label htmlFor="edit_last_name" className="block text-sm font-medium text-gray-700">Nom de famille</label>
                        <input
                          id="edit_last_name"
                          type="text"
                          name="last_name"
                          value={formDataStudent.last_name}
                          onChange={handleStudentFormChange}
                          required
                          className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Grille pour Matricule et Classe */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      {/* Champ: Matricule étudiant */}
                      <div>
                        <label htmlFor="edit_student_id" className="block text-sm font-medium text-gray-700">Matricule étudiant</label>
                        <input
                          id="edit_student_id"
                          type="text"
                          name="student_id"
                          value={formDataStudent.student_id}
                          onChange={handleStudentFormChange}
                          required
                          // Rendre le matricule en lecture seule s'il sert d'identifiant permanent.
                          // Si vous voulez qu'il soit modifiable, retirez 'readOnly'
                          readOnly
                          className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed shadow-sm"
                        />
                      </div>

                      {/* Champ: Classe */}
                      <div>
                        <label htmlFor="edit_class_group" className="block text-sm font-medium text-gray-700">Classe</label>
                        <select
                          id="edit_class_group"
                          name="class_group"
                          value={formDataStudent.class_group}
                          onChange={handleStudentFormChange}
                          required
                          className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        >
                          <option value="" disabled>Sélectionner une classe</option>
                          <option value="L1 Info">L1 Info</option>
                          <option value="L2 Info">L2 Info</option>
                          <option value="L3 Info">L3 Info</option>
                        </select>
                      </div>
                    </div>



                    {/* Boutons d'action */}
                    <div className="pt-4 flex justify-between space-x-3">

                      {/* Bouton Annuler (Secondaire) */}
                      <button
                        type="button"
                        className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 ease-in-out"
                        onClick={() => setIsEditModalOpen(false)}
                      >
                        Annuler
                      </button>

                      {/* Bouton Mise à jour (Principal - Couleur Bleue pour l'action principale) */}
                      <button
                        type="submit"
                        className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition duration-150 ease-in-out shadow-md ${update
                          ? 'bg-blue-400 cursor-not-allowed' // État de soumission
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' // État normal
                          }`}
                        disabled={update}
                      >
                        {update ? 'Mise à jour en cours...' : 'Sauvegarder les modifications'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        {/* Z-index élevé (z-50) pour s'assurer que la modale est au-dessus des autres éléments */}
        <Dialog as="div" className="relative z-50" onClose={() => setIsDeleteModalOpen(false)}>

          {/* Backdrop (Amélioré: sombre et flou) */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* Arrière-plan plus sombre et flou pour un effet moderne */}
            <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/* Conteneur de la modale : max-w-sm (légèrement réduit) et padding p-6 */}
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-2xl transition-all">

                  {/* Contenu de la modale */}
                  <div className="sm:flex sm:items-start">
                    {/* Icône de danger (Placeholder, nécessite une librairie d'icônes) */}
                    <div className="mx-auto flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                      {/* Remplacez par votre icône de suppression/alerte (ex: <XCircleIcon className="h-6 w-6 text-red-600" />) */}
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.857 3.375 2.75 3.375h13.71c1.892 0 3.614-1.875 2.748-3.375L15.378 3.84a1.725 1.725 0 00-3.003 0l-6.326 11.23a1.725 1.725 0 00-.001 1.764z" />
                      </svg>
                    </div>

                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900">
                        Confirmer la suppression
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Voulez-vous vraiment supprimer {itemTypeToDelete === 'student' ? 'cet étudiant' : 'ce projet'} ? Cette action est irréversible et toutes les données associées seront perdues.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action (Positionnement modernisé : Annuler à gauche, Action à droite) */}
                  <div className="mt-6 flex justify-between space-x-3">

                    {/* Bouton Annuler (Secondaire) */}
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition duration-150 ease-in-out"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Annuler
                    </button>

                    {/* Bouton Supprimer (Principal - Couleur Rouge) */}
                    <button
                      type="button"
                      onClick={confirmDelete}
                      disabled={loadindDelete}
                      // Design de bouton plus large et plus pro
                      className={`inline-flex justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-white shadow-md transition duration-150 ease-in-out ${loadindDelete
                        ? 'bg-red-400 cursor-not-allowed' // État de chargement
                        : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2' // État normal
                        }`}
                    >
                      {loadindDelete ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
