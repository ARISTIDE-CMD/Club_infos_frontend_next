type StudentHitProps = {
  hit: {
    id: string;
    first_name: string;
    last_name: string;
    class_group: string;
    __position: number;
  };
};

export function StudentHit({ hit }: StudentHitProps) {
  return (
    <li key={hit.id} className="p-4 mb-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors">
      <div className="text-lg font-medium text-gray-800">
        {hit.first_name} {hit.last_name}
      </div>
      <div className="text-sm text-gray-500 mt-1">
        Groupe : {hit.class_group} <br />
        id : {hit.id}
      </div>
    </li>
  );
}
