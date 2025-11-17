'use client';
import { useState } from 'react';
import { searchStudents } from '@/public/lib/typesense';

export default function StudentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      const res = await searchStudents(e.target.value);
      setResults(res);
    } else {
      setResults([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher un étudiant..."
        value={query}
        onChange={handleSearch}
        className="p-2 border rounded"
      />
      <ul>
        {results.map(student => (
          <li key={student.id}>{student.first_name} {student.last_name} - {student.class_group}</li>
        ))}
      </ul>
    </div>
  );
}
