
import { useState } from "react";

interface EvaluationFormProps {
  submissionId: number;
  onEvaluate: (submissionId: number, grade: number, comment: string) => void;
  loading: boolean;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ submissionId, onEvaluate, loading }) => {
  const [grade, setGrade] = useState<number | "">();
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(comment=="") return
    if (grade === "" || isNaN(Number(grade))) {
  onEvaluate(submissionId, 0, comment); // ou null si autorisé
  return;
}
    onEvaluate(submissionId, Number(grade), comment);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-4 rounded-xl">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <span>📝</span>
        <span className="font-semibold">Évaluer la soumission</span>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Note (/20)</label>
        <input
          type="number"
          step="0.5"
          min="0"
          max="20"
          value={grade}
          onChange={(e) => setGrade(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-full mt-1 px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition resize-none hover:border-green-300"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Commentaire</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full mt-1 px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition resize-none hover:border-green-300"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : "Enregistrer l'évaluation"}
      </button>
    </form>
  );
};

export default EvaluationForm;
