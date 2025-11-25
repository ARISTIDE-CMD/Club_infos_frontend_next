import { Pagination } from 'react-instantsearch';

export function PaginationControls() {
  return (
    <div className="mt-6 flex justify-center">
      <Pagination
        classNames={{
          list: "flex space-x-2",
          item: "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300",
          link: "focus:outline-none",
          selectedItem: "bg-blue-600 text-white",
        }}
      />
    </div>
  );
}
