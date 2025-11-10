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

interface Category {
    id: number | null;
    name: string | null;
}
interface Teacher {
    department: string;
    speciality: string;
    // category_id: number;
    // category: string | null;
    category?: {
        id: number | null;
        name: string | null;
    }

}

interface Institutor {
    teacher: Teacher;
    id: number;
    user_id: number;
    name: string;
    department: string;
    speciality: string;
    category_id: number;
    category: string | null;
    created_at: string;
    updated_at: string;
}

type stude = {
    id: number;
    last_name: string;
    first_name: string
}

export interface Project { id: number; title: string; type: string; submission?: Submission | null; }


export interface Submission {
    id: number;
    file_path: string;
    evaluation?: {
        grade: number | null;
        comment: string | null;
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

export interface SubmissionItemProps {
    submission: Submission;
    projectCreatedAt: Date;
    submissionCreatedAt: Date;
    durationDays: number;
    durationHours: number;
    durationsMinut: number;
    onArchiveToggle: (id: number) => void;
}

export interface User { id: number; name: string; email: string; role: string; }
export interface StudentLis { filter(arg0: (s: StudentLis) => void): StudentLis[]; id: number; first_name: string; last_name: string; student_id: string; class_group: string; user: User; teacher_name?: string | null; projects: Project[]; created_at: string; }

