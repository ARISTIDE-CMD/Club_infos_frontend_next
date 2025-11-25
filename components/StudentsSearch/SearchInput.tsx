import { SearchBox } from 'react-instantsearch';

type SearchInputProps = {
  placeholder?: string;
  classNames?: Record<string, string>;
};

export function SearchInput({ placeholder, classNames }: SearchInputProps) {
  return (
    <div className="mb-6 w-full">
      <SearchBox
        placeholder={placeholder}
        classNames={classNames}
      />
    </div>
  );
}
